import LoginComponent from '../../login/login.po';
import { open } from '../../../utilities/hooks.async';

import ComplaintsComponent from './complaints.po';

let login;
let component;

beforeEach(async () => {
  component = new ComplaintsComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the complaints component', () => {
  describe('when logged in as an ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => component.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have table headers in a defined order', async () => {
      const expectedHeaders = ['ONC-ACB', 'Status', 'Received Date', 'ONC-ACB Complaint ID', 'ONC Complaint ID', 'Complainant Type', 'Actions'];
      const actualHeaders = (await component.getHeaders()).map(async (header) => header.getText());
      await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
      await expectedHeaders.forEach(async (exp, idx) => expect((await actualHeaders[idx]).includes(exp)).toBe(true));
    });

    it('should have a button to download results', async () => {
      const button = await component.downloadResultsButton;
      await expect(/Download all complaints/i.test(await button.getText())).toBe(true);
    });
  });

  describe('when logged in as ROLE_ACB', () => {
    beforeEach(async () => {
      await login.logIn('drummond');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => component.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should not have a button to download results', async () => {
      const button = await component.downloadResultsButton;
      await expect(await button.isExisting()).toBe(false);
    });

    describe('when searching complaints by text', () => {
      afterEach(async () => {
        await component.clearSearchTerm();
      });

      it('should only show the complaint that has that ONC-ACB Complaint ID', async () => {
        const searchTerm = 'SC-000093';
        const columnIndex = 2;
        await component.searchForText(searchTerm);
        await expect(await component.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should only show the complaint that has that ONC Complaint ID', async () => {
        const searchTerm = 'HIC-2669';
        const columnIndex = 3;
        await component.searchForText(searchTerm);
        await expect(await component.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should only show the complaint that has that Associated Certified Product', async () => {
        const searchTerm = '15.04.04.1221.Soar.15.00.1.180611';
        await component.searchForText(searchTerm);
        await (await component.viewButton).click();
        await expect(await component.complaintsBody()).toContain(searchTerm);
        await (await component.backToComplaintsButton).click();
      });

      it('should only show the complaint that has that Associated Criteria', async () => {
        const searchTerm = '170.315 (a)(1)';
        await component.searchForText(searchTerm);
        await (await component.viewButton).click();
        await expect(await component.complaintsBody()).toContain(searchTerm);
        await (await component.backToComplaintsButton).click();
      });
    });

    describe('when searching complaints with filters', () => {
      afterEach(async () => {
        await component.resetFilters();
      });

      it('should only show the complaints that has all of search options used', async () => {
        await component.setListFilter('complainantTypes', 'Anonymous');
        await component.setListFilter('currentStatuses', 'Closed');
        const complaints = (await component.getTableComplaints());
        complaints.forEach(async (complaint) => {
          await expect(await (await component.getComplaintCell(complaint, 4)).getText()).toContain('Anonymous');
          return expect(await (await component.getComplaintCell(complaint, 0)).getText()).toContain('CLOSED');
        });
      });
    });
  });
});
