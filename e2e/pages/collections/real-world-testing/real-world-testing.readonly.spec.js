import { open } from '../../../utilities/hooks.async';

import RealWorldTestingPage from './real-world-testing.po';

const path = require('path');
const fs = require('fs');

const config = require('../../../config/mainConfig');

let page;

describe('the Real World Testing collection page', () => {
  beforeEach(async () => {
    page = new RealWorldTestingPage();
    await open('#/collections/real-world-testing');
    await (browser.waitUntil(async () => !(await page.isLoading())));
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This list includes Health IT Module(s) eligible for Real World Testing, which is an annual');
    await expect(await page.getBodyText()).toContain('If applicable, Real World Testing plans are required to be made publicly available on the CHPL annually by December 15th. Additionally, Real World Testing results are to be made publicly available on the CHPL by March 15th of the subsequent year.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer', 'Product', 'Version', 'Certification Status', 'Real World Testing Plans URL', 'Real World Testing Results URL'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    for (const [idx, header] of actualHeaders.entries()) {
      await expect(await header.getText()).toBe(expectedHeaders[idx]);
    }
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      let countBefore;
      let countAfter;

      beforeEach(async () => {
        countBefore = await page.getTotalResultCount();
      });

      afterEach(async () => {
        await page.resetFilters();
      });

      it('should filter on edition', async () => {
        await page.removeFilter('Certification Edition', '2015');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on rwt plans URLs', async () => {
        await page.removeFilter('Real World Testing', 'Has RWT Plans URL');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on status', async () => {
        await page.setListFilter('certificationStatuses', 'Withdrawn_by_Developer');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeGreaterThan(countBefore);
      });
    });

    describe('by text', () => {
      afterEach(async () => {
        await page.clearSearchTerm();
      });

      it('should show only listings that match the CHPL ID', async () => {
        const searchTerm = '3125.Powe';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the developer', async () => {
        const searchTerm = 'CorrecTek';
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Veracity';
        const columnIndex = 3;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });

  // ignored as file download is an unsolved test
  xdescribe('when clicking on all RWT download button', () => {
    it('should download a file', async () => {
      await page.downloadRealWorldTesting.click();
      const expectedFileName = 'real-world-testing';
      await browser.pause(config.timeout);
      const files = fs.readdirSync(global.downloadDir);
      const fileName = files.filter((file) => file.match(new RegExp(`${expectedFileName}.*.csv`))).toString();
      await expect(fileName).toContain(expectedFileName);
      const filePath = path.join(global.downloadDir, fileName);
      const stat = fs.statSync(filePath);
      await expect(stat.size).toBeGreaterThan(10);
    });
  });
});
