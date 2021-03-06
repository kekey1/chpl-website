(() => {
  /** @ngInject */
  function ApiDocumentationController($log, API, SPLIT_PRIMARY, SPLIT_SECONDARY, authService, networkService) {
    const vm = this;

    function activate() {
      vm.columnSet = [
        {
          predicate: 'developer', display: 'Developer', sortType: 'multi', isDeveloperLink: true,
        },
        { predicate: 'product', display: 'Product', sortType: 'single' },
        { predicate: 'version', display: 'Version', sortType: 'single' },
        {
          predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true,
        },
        {
          predicate: 'apiDocumentation', display: 'API Documentation', sortType: 'single', transformFn: vm.criteriaUrlTransform,
        },
        {
          predicate: 'serviceBaseUrlList', display: 'Service Base URL List', sortType: 'single', transformFn: vm.criteriaUrlTransform,
        },
        {
          predicate: 'transparencyAttestationUrl', display: 'Mandatory Disclosures URL', sortType: 'single', transformFn: vm.disclosuresTransform,
        },
      ];
      vm.filters = ['certificationStatus'];
      vm.refineModel = {
        certificationStatus: [
          { value: 'Active', selected: true },
          { value: 'Suspended by ONC', selected: true },
          { value: 'Suspended by ONC-ACB', selected: true },
          { value: 'Retired', selected: false },
          { value: 'Withdrawn by Developer', selected: false },
          { value: 'Withdrawn by Developer Under Surveillance/Review', selected: false },
          { value: 'Withdrawn by ONC-ACB', selected: false },
          { value: 'Terminated by ONC', selected: false },
        ],
      };

      vm.API = API;
      vm.API_KEY = authService.getApiKey();
      vm.apiDocument = `${vm.API}/files/api_documentation?api_key=${vm.API_KEY}`;
      networkService.getApiDocumentationDate().then((response) => {
        vm.apiDate = response.associatedDate;
      });
    }

    /// /////////////////////////////////////////////////////////////////

    function criteriaUrlTransform(data) {
      let ret = 'N/A';
      if (data) {
        const apis = {};
        const pairs = data.split(SPLIT_PRIMARY);
        for (let i = 0; i < pairs.length; i += 1) {
          const items = pairs[i].split(SPLIT_SECONDARY);
          const [key, value] = items;
          if (value) {
            if (!apis[value]) {
              apis[value] = [];
            }
            apis[value].push(key);
          }
        }
        ret = '<dl>';
        angular.forEach(apis, (value, key) => {
          ret += `<dt>${value.join(', ')}</dt><dd><a ai-a href="${key}" analytics-on="click" analytics-event="Go to API Documentation Website" analytics-properties="{ category: 'API Information for 2015 Edition Products' }">${key}</a></dd>`;
        });
        ret += '</dl>';
      }
      return ret;
    }

    function disclosuresTransform(data) {
      let ret = 'Unknown';
      if (data) {
        ret = `<a ai-a href="${data}" analytics-on="click" analytics-event="Go to Mandatory Disclosures Website" analytics-properties="{ category: 'API Information for 2015 Edition Products' }">${data}</a>`;
      }
      return ret;
    }

    vm.criteriaUrlTransform = criteriaUrlTransform;
    vm.disclosuresTransform = disclosuresTransform;

    activate();
  }

  angular.module('chpl.collections')
    .controller('ApiDocumentationController', ApiDocumentationController);
})();
