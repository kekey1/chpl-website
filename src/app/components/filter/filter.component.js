export const FilterComponent = {
    templateUrl: 'chpl.components/filter/filter.html',
    bindings: {
        title: '@',
        hasChanges: '<',
    },
    transclude: true,
    require: {
        filtersCtrl: '^chplFilters',
    },
    controller: class FilterComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onInit () {
            this.filtersCtrl.addFilter(this);
        }

        /*
          onApplyFilter (filter) {
          let f = angular.fromJson(filter);
          this.doFilter(f);
          }

          onClearFilter () {
          let filterData = {};
          filterData.dataFilter = '';
          filterData.tableState = this.tableController.tableState();
          this.clearFilterHs.forEach(handler => handler());
          this.doFilter(filterData);
          }

          doFilter (filter) {
          let that = this;
          this.filterText = filter.dataFilter;
          let filterItems = [
          'acbName',
          'complaintStatusTypeName',
          'receivedDate',
          'closedDate',
          'complainantTypeName',
          'complainantContacted',
          'developerContacted',
          'oncAtlContacted',
          ];
          filterItems.forEach(predicate => {
          if (filter.tableState.search.predicateObject[predicate]) {
          this.tableController.search(filter.tableState.search.predicateObject[predicate], predicate);
          } else {
          this.tableController.search({}, predicate);
          }
          });
          this.restoreStateHs.forEach(handler => handler(that.tableController.tableState()));
          this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
          }

          registerClearFilter (handler) {
          this.clearFilterHs.push(handler);
          }

          registerRestoreState (handler) {
          this.restoreStateHs.push(handler);
          }

          getFilterData () {
          let filterData = {};
          filterData.dataFilter = this.filterText;
          filterData.tableState = this.tableController.tableState();
          return filterData;
          }

          tableStateListener (tableController) {
          this.tableController = tableController;
          }
        */
    },
}

angular.module('chpl.components')
    .component('chplFilter', FilterComponent);
