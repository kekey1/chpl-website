const suite = {
  description: 'with invalid or missing data',
  file: '../../../resources/listings/2015_InvalidAndMissingData.csv',
  listings: [{
    listingId: '13A!.AA.04.8990.FMT.0A@.AA.A.20230729',
    expectedErrors: [
      'The version code is required and must be 2 characters in length containing only the characters A-Z, a-z, 0-9, and _.',
      'The value for Mandatory Disclosures \'examplek1.com\' is not a valid URL.',
      'The product code is required and must be 4 characters in length containing only the characters A-Z, a-z, 0-9, and _.',
      'The developer code from the CHPL Product Number 8990 does not match the code of the declared developer 1722.',
      'The certified date code is required and must be 6 characters in length containing only the characters 0-9.',
      'The additional software code is required and must be 1 character in length containing only the characters 0 or 1.',
      'The ONC-ATL code is required and must be 2 characters in length containing only the characters 0-9.',
      'The ICS code is required and must be 2 characters in length with a value between 00-99. If you have exceeded the maximum inheritance level of 99, please contact the CHPL team for further assistance.',
      'The Edition code is required and must be 2 characters in length containing only the characters 0-9.',
      'The \'Accessibility Certified\' value is \'false\' but 1 Accessibility Standard(s) were found.',
      'Testing Lab is required but not found.',
      'No certification date was found.',
      'Applicable criteria is required for each QMS Standard listed.',
      'A certification edition is required for the listing.',
      'The ONC-ACB test� is not valid.',
    ],
    expectedWarnings: [
      'An unrecognized character was found for ACB Name \'test�\'. Please check the input data.',
      'An unrecognized character was found for ACB Certification ID \'15.04.04.�.AQA22.V1.00.0.200707\'. Please check the input data.',
    ],
  }, {
    listingId: '15.02.04.2701.REQ1.12.01.1.200620',
    expectedErrors: [
      'The unique id indicates the product does have additional software but none is specified in the upload file.',
      'The ICS value is \'true\' which means this listing has inherited properties. It is required that at least one parent from which the listing inherits be provided.',
      'The \'Accessibility Certified\' value is \'true\' but 0 Accessibility Standard(s) were found.',
      'Test tools are required for certification criteria 170.315 (g)(10).',
      'Service Base URL List is required for certification 170.315 (g)(10).',
      'QMS Standard(s) are required.',
      'Privacy and Security Framework is required for certification 170.315 (g)(10).',
      'GAP is required for certification 170.315 (d)(1).',
      'API Documentation is required for certification 170.315 (g)(10).',
      'Accessibility Standard(s) are required.',
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.02.04.2701.REQ2.12.00.0.200620',
    expectedErrors: [
      'There was no version found for test tool Edge Testing Tool and certification 170.315 (g)(6) (Cures Update).',
      'The value for Documentation Url in criteria 170.315 (d)(13) is not a valid URL.',
      'The value for Use Cases in criteria 170.315 (d)(13) is not a valid URL.',
      'The unique id indicates the product does not have additional software but some is specified in the upload file.',
      'Privacy and Security Framework is required for certification 170.315 (a)(1).',
      'Privacy and Security Framework is required for certification 170.315 (b)(1) (Cures Update).',
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.',
      'GAP is required for certification 170.315 (d)(1).',
      'Export Documentation is required for certification 170.315 (b)(10).',
      'Criteria 170.315 (b)(10) indicates additional software should be present but none was found.',
      'Certification 170.315 (b)(10) contains Privacy and Security Framework value \'Approach 3 and 4\' which must match one of \'Approach 1\', \'Approach 2\', \'Approach 1;Approach 2\'.',
      'Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Tool: Name \'Edge Testing Tool\'.',
      'Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Data: Name \'ONC Test Method\'.',
      '170.315 (g)(3) is required but was not found.',
    ],
    expectedWarnings: [
      'Certification 170.315 (a)(1) contains duplicate Test Functionality: Number \'(a)(1)(ii)\'. The duplicates have been removed.',
      'Criteria 170.315 (b)(1) (Cures Update) contains an invalid test tool \'test tool\'. It has been removed from the pending listing.',
      'Criteria 170.315 (a)(1) contains an invalid test functionality \'(a)(1)(ii)123\'. It has been removed from the pending listing.',
      'Certification 170.315 (d)(13) has a Use Case but no Attestation Answer.',
      'Test data \'test data\' is invalid for the criterion 170.315 (b)(1) (Cures Update) and has been removed from the listing.',
      'CHPL certification ID was not found.',
    ],
  }],
};

export default suite;
