export const EditAcbComponent = {
    templateUrl: 'chpl.admin/components/acb/edit.html',
    bindings: {
        acb: '<',
        action: '@',
        onChange: '&',
    },
    controller: class EditAcbController {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
            }
        }

        update () {
            const change = {
                acb: angular.copy(this.acb),
                valid: this.editForm.$valid,
            };
            this.onChange(change);
        }
    },
}

angular.module('chpl.admin')
    .component('aiEditAcb', EditAcbComponent);
