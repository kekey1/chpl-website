(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditCertifiedProductController', EditCertifiedProductController);

    /** @ngInject */
    function EditCertifiedProductController ($filter, $log, $timeout, $uibModalInstance, activeCP, isAcbAdmin, isChplAdmin, networkService, resources, utilService, workType) {
        var vm = this;

        vm.addPreviousStatus = addPreviousStatus;
        vm.addNewValue = utilService.addNewValue;
        vm.attachModel = attachModel;
        vm.cancel = cancel;
        vm.certificationStatus = utilService.certificationStatus;
        vm.disabledParent = disabledParent;
        vm.disabledStatus = disabledStatus;
        vm.extendSelect = utilService.extendSelect;
        vm.hasDateMatches = hasDateMatches;
        vm.hasStatusMatches = hasStatusMatches;
        vm.improperFirstStatus = improperFirstStatus;
        vm.matchesPreviousDate = matchesPreviousDate;
        vm.matchesPreviousStatus = matchesPreviousStatus;
        vm.missingIcsSource = missingIcsSource;
        vm.reasonRequired = reasonRequired;
        vm.removePreviousStatus = removePreviousStatus;
        vm.requiredIcsCode = requiredIcsCode;
        vm.save = save;
        vm.willCauseSuspension = willCauseSuspension;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.cp = angular.copy(activeCP);
            vm.cp.certDate = new Date(vm.cp.certificationDate);
            vm.isAcbAdmin = isAcbAdmin;
            vm.isChplAdmin = isChplAdmin;
            vm.bodies = resources.bodies;
            vm.accessibilityStandards = resources.accessibilityStandards;
            vm.classifications = resources.classifications;
            vm.practices = resources.practices;
            resources.qmsStandards.data = resources.qmsStandards.data
                .concat(vm.cp.qmsStandards.filter(function (standard) { return !standard.id }).map(function (standard) {
                    standard.name = standard.qmsStandardName;
                    return standard;
                }));
            vm.qmsStandards = resources.qmsStandards;
            vm.statuses = resources.statuses;
            vm.targetedUsers = resources.targetedUsers;
            vm.testingLabs = resources.testingLabs;
            vm.resources = resources;
            vm.workType = workType;
            vm.showFormErrors = false;
            vm.message = '';
            if (angular.isUndefined(vm.cp.ics.parents)) {
                vm.cp.ics.parents = [];
            }
            if (vm.cp.chplProductNumber.length > 12) {
                var idFields = vm.cp.chplProductNumber.split('.');
                vm.idFields = {
                    prefix: idFields[0] + '.' + idFields[1] + '.' + idFields[2] + '.' + idFields[3],
                    prod: idFields[4],
                    ver: idFields[5],
                    ics: idFields[6],
                    suffix: idFields[7] + '.' + idFields[8],
                };
            }
            for (var i = 0; i < vm.cp.certificationEvents.length; i++) {
                vm.cp.certificationEvents[i].statusDateObject = new Date(vm.cp.certificationEvents[i].eventDate);
            }

            vm.handlers = [];
            vm.attachModel();
            loadFamily();
        }

        function addPreviousStatus () {
            vm.cp.certificationEvents.push({
                statusDateObject: new Date(),
                status: {},
            });
        }

        function attachModel () {
            vm.cp.practiceType = utilService.findModel(vm.cp.practiceType, vm.practices);
            vm.cp.classificationType = utilService.findModel(vm.cp.classificationType, vm.classifications);
            vm.cp.certifyingBody = utilService.findModel(vm.cp.certifyingBody, vm.bodies);
            if (vm.cp.testingLab) {
                vm.cp.testingLab = utilService.findModel(vm.cp.testingLab, vm.testingLabs);
            }
            vm.cp.certificationEvents.forEach(function (ce) {
                ce.status = utilService.findModel(ce.status, vm.statuses);
            });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function disabledParent (listing) {
            var ret = false;
            ret = ret || vm.cp.chplProductNumber === listing.chplProductNumber;
            for (var i = 0; i < vm.cp.ics.parents.length; i++) {
                ret = ret || vm.cp.ics.parents[i].chplProductNumber === listing.chplProductNumber;
            }
            return ret;
        }

        function disabledStatus (name) {
            return ((name === 'Pending' && vm.workType === 'manage') || (name !== 'Pending' && vm.workType === 'confirm'));
        }

        function hasDateMatches () {
            var ret = false;
            for (var i = 0; i < vm.cp.certificationEvents.length; i++) {
                ret = ret || vm.matchesPreviousDate(vm.cp.certificationEvents[i]);
            }
            return ret;
        }

        function hasStatusMatches () {
            var ret = false;
            for (var i = 0; i < vm.cp.certificationEvents.length; i++) {
                ret = ret || vm.matchesPreviousStatus(vm.cp.certificationEvents[i]);
            }
            return ret;
        }

        function improperFirstStatus () {
            return $filter('orderBy')(vm.cp.certificationEvents,'statusDateObject')[0].status.name !== 'Active';
        }

        function matchesPreviousDate (event) {
            var orderedStatus = $filter('orderBy')(vm.cp.certificationEvents,'statusDateObject');
            var statusLoc = orderedStatus.indexOf(event);
            if (statusLoc > 0) {
                return ($filter('date')(event.statusDateObject, 'mediumDate', 'UTC') === $filter('date')(orderedStatus[statusLoc - 1].statusDateObject, 'mediumDate', 'UTC'));
            }
            return false;
        }

        function matchesPreviousStatus (event) {
            var orderedStatus = $filter('orderBy')(vm.cp.certificationEvents,'statusDateObject');
            var statusLoc = orderedStatus.indexOf(event);
            if (statusLoc > 0) {
                return (event.status.name === orderedStatus[statusLoc - 1].status.name);
            }
            return false;
        }

        function missingIcsSource () {
            return vm.cp.certificationEdition.name === '2015' && vm.cp.ics.inherits && vm.cp.ics.parents.length === 0;
        }

        function reasonRequired () {
            return vm.cp.certificationEvents.reduce(function (ret, ce) {
                return ret || (ce.status.name === 'Withdrawn by ONC-ACB' &&
                              (!ce.reason || ce.reason === ''));
            }, false);
        }

        function removePreviousStatus (idx) {
            vm.cp.certificationEvents.splice(idx, 1);
        }

        function requiredIcsCode () {
            var code = vm.cp.ics.parents
                .map(function (item) { return parseInt(item.chplProductNumber.split('.')[6], 10); })
                .reduce(function (max, cur) { return Math.max(max, cur); }, -1)
                + 1;
            return (code > 9 || code < 0) ? '' + code : '0' + code;
        }

        function save () {
            for (var i = 0; i < vm.cp.certificationEvents.length; i++) {
                vm.cp.certificationEvents[i].eventDate = vm.cp.certificationEvents[i].statusDateObject.getTime();
            }
            if (vm.cp.chplProductNumber.length > 12) {
                vm.cp.chplProductNumber =
                    vm.idFields.prefix + '.' +
                    vm.idFields.prod + '.' +
                    vm.idFields.ver + '.' +
                    vm.idFields.ics + '.' +
                    vm.idFields.suffix;
            }
            vm.cp.certificationDate = vm.cp.certDate.getTime();
            if (vm.workType === 'manage') {
                vm.isSaving = true;
                networkService.updateCP({
                    listing: vm.cp,
                    banDeveloper: vm.banDeveloper,
                }).then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        vm.errors = [response.error];
                        vm.isSaving = false;
                    }
                },function (error) {
                    vm.errors = [];
                    vm.warnings = [];
                    if (error.data) {
                        if (error.data.error && error.data.error.length > 0) {
                            vm.errors.push(error.data.error);
                        }
                        if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                            vm.errors = vm.errors.concat(error.data.errorMessages);
                        }
                        if (error.data.warningMessages && error.data.warningMessages.length > 0) {
                            vm.warnings = vm.warnings.concat(error.data.warningMessages);
                        }
                    }
                    vm.isSaving = false;
                });
            } else if (vm.workType === 'confirm') {
                $uibModalInstance.close(vm.cp);
            } else {
                $log.info('Cannot save; no work type found');
            }
        }

        function willCauseSuspension (name) {
            switch (name) {
            case ('Active'):
            case ('Retired'):
            case ('Suspended by ONC-ACB'):
            case ('Suspended by ONC'):
            case ('Withdrawn by Developer'):
            case ('Withdrawn by ONC-ACB'):
                return false;
            case ('Terminated by ONC'):
            case ('Withdrawn by Developer Under Surveillance/Review'):
                return true;
            default: return false;
            }
        }

        ////////////////////////////////////////////////////////////////////

        function loadFamily () {
            if (vm.cp.product && vm.cp.product.productId && vm.cp.certificationEdition.name === '2015') {
                networkService.getRelatedListings(vm.cp.product.productId)
                    .then(function (family) {
                        vm.relatedListings = family.filter(function (item) { return item.edition === '2015' });
                    });
            }
        }
    }
})();
