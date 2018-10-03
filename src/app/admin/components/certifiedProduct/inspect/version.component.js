export const InspectVersionComponent = {
    templateUrl: 'chpl.admin/components/certifiedProduct/inspect/version.html',
    bindings: {
        pendingVersion: '<',
        product: '<',
        onSelect: '&',
    },
    controller: class InspectVersionController {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.pendingVersion) {
                this.pendingVersion = angular.copy(changes.pendingVersion.currentValue);
            }
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
            }
            if (this.pendingVersion && this.pendingVersion.versionId) {
                this.networkService.getVersion(this.pendingVersion.versionId)
                    .then(result => this.systemVersion = result);
            }
            if (this.product && this.product.productId) {
                this.choice = 'choose';
                this.networkService.getVersionsByProduct(this.product.productId)
                    .then(result => this.availableVersions = result);
            } else {
                this.choice = 'create';
            }
        }

        select () {
            this.$log.debug('select', this);
            this.$log.debug('onselect', this.onSelect);
            this.pendingVersion.versionId = this.versionSelect.versionId;
            this.onSelect({versionId: this.versionSelect.versionId});
        }
    },
}

angular.module('chpl.admin')
    .component('aiInspectVersion', InspectVersionComponent);
