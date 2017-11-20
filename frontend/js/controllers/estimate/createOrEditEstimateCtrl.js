myApp.controller('createOrEditEstimateCtrl', function ($scope, toastr, $stateParams, createOrEditEstimateService, $uibModal) {


	// *************************** default variables/tasks begin here ***************** //
	//- to show/hide sidebar of dashboard 
	$scope.$parent.isSidebarActive = false;
	$scope.showSaveBtn = true;
	$scope.showEditBtn = false;
	$scope.bulkItems = [];
	$scope.checkboxStatus = false; //- for multiple deletion
	$scope.checkAll = false;
	$scope.hardFacingAlloys = [];

	if (angular.isDefined($stateParams.estimateId)) {
		$scope.draftEstimateId = $stateParams.estimateId;
	}


	// *************************** default functions begin here  ********************** //
	//- to get all views of createOrEdit estimate screen dynamically 
	$scope.getEstimateView = function (getViewName, getLevelName, subAssemblyId, partId) {
		createOrEditEstimateService.estimateView(getViewName, function (data) {
			$scope.estimateView = data;
		});
		createOrEditEstimateService.estimateViewData(getViewName, getLevelName, subAssemblyId, partId, function (data) {
			$scope.level = getLevelName;
			$scope.estimateViewData = data;
			$scope.bulkItems = [];
		});
	}
	//- get data to generate tree structure dynamically i.e. get assembly stucture
	$scope.getEstimateData = function () {
		createOrEditEstimateService.getEstimateData($scope.draftEstimateId, function (data) {
			$scope.estimteData = data;
		});
	}
	$scope.getCurretEstimateObj = function () {
		createOrEditEstimateService.getCurretEstimateObj(function (data) {
			$scope.estimteData = data;
		});
	}
	$scope.getCustomMaterialData = function () {
		createOrEditEstimateService.getCustomMaterialData(function (customData) {
			$scope.customData = customData;
		});
	}

	$scope.$watch('estimteData', function (newValue, oldValue) {
		if (newValue != oldValue) {
			$.jStorage.set("estimateObject", $scope.estimteData);
		}
	}, true);

	// *************************** functions to be triggered form view begin here ***** //
	//- to edit assembly name
	//- Edit Assembly Name modal start
	$scope.editAssemblyNameModal = function (assembly) {
		$scope.formData = assembly;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/estimate/estimateModal/editAssemblyName.html',
			scope: $scope,
			size: 'md'
		});
	}
	$scope.editAssemblyName = function (assemblyName) {
		createOrEditEstimateService.editAssemblyName(assemblyName, $scope.draftEstimateId, function (data) {
			$scope.getEstimateData();
			$scope.cancelModal();
		});
	}
	//- to update estimate object in draftEstimate table
	$scope.saveCurrentEstimate = function () {
		createOrEditEstimateService.saveCurrentEstimate(function (data) {
			$scope.getEstimateData();
			toastr.info('Estimate data updated successfully', 'Estimate Updation!');
		});
	}
	//- Import SubAssembly
	$scope.importAssemblyModal = function () {

		$scope.subAssId;
		createOrEditEstimateService.getAllAssemblyNumbers(function (data) {
			$scope.assemblyData = data;
			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/importAssembly.html',
				scope: $scope,
				size: 'md',
			});
		});
	}
	// $scope.importAssembly = function (assemblyId) {
	// 	createOrEditEstimateService.getImportAssemblyData(assemblyId, function () {
	// 		$scope.getCurretEstimateObj();
	// 		toastr.info('Assebly imported successfully', 'Assembly Import!');
	// 		$scope.cancelModal();
	// 	});
	// }

	//- to add or edit subAssembly data
	$scope.addOrEditSubAssemblyModal = function (operation, subAssembly) {
		createOrEditEstimateService.getAllSubAssModalData(operation, subAssembly, function (data) {

			$scope.formData = data.subAssObj;
			$scope.showSaveBtn = data.saveBtn;
			$scope.showEditBtn = data.editBtn;

			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/createOrEditSubAssemblyName.html',
				scope: $scope,
				size: 'md'
			});
		});
	}
	$scope.addSubAssembly = function (subAssemblyData) {

		createOrEditEstimateService.createSubAssembly(subAssemblyData, function () {
			$scope.getCurretEstimateObj();
			$scope.cancelModal();
		});
	}
	$scope.editSubAssembly = function (number) {
		$scope.getCurretEstimateObj();
		$scope.cancelModal();
	}
	//- modal to confirm subssembly deletion
	$scope.deleteSubAssemblyModal = function (subAssemblyId, getFunction) {
		$scope.idToDelete = subAssemblyId;
		$scope.functionToCall = getFunction;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
			scope: $scope,
			size: 'md'
		});
	}
	$scope.deleteSubAssembly = function (subAssemblyId) {
		createOrEditEstimateService.deleteSubAssembly(subAssemblyId, function () {
			toastr.info('SubAssembly deleted successfully', 'SubAssembly Deletion!');
			$scope.getEstimateView('assembly');
			$scope.cancelModal();
		});
	}
	//- function to delete bulk subAssemblies
	$scope.deleteMultipleSubAssemblies = function (subAssIds) {
		createOrEditEstimateService.deleteMultipleSubAssemblies(subAssIds, function () {
			$scope.bulkItems = [];
			$scope.checkAll = false;
			$scope.checkboxStatus = false;

			$scope.getEstimateView('assembly');
			$scope.cancelModal();
			toastr.info('SubAssemblies deleted successfully', 'SubAssemblies Deletion!');
		});
	}
	//- Import SubAssembly
	$scope.importSubAssemblyModal = function () {
		$scope.subAssId;
		createOrEditEstimateService.getAllSubAssNumbers(function (data) {
			$scope.subAssemblyData = data;
			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/importSubAssembly.html',
				scope: $scope,
				size: 'md',
			});
		});
	}
	$scope.importSubAssembly = function (subAssId) {
		createOrEditEstimateService.getImportSubAssemblyData(subAssId, function () {
			$scope.getCurretEstimateObj();
			toastr.info('SubAssembly imported successfully', 'SubAssembly Import!');
			$scope.cancelModal();
		});
	}

	//- to add or edit part name
	$scope.addOrEditPartModal = function (operation, subAssId, part) {
		createOrEditEstimateService.getAllPartModalData(operation, subAssId, part, function (data) {
			$scope.showSaveBtn = data.saveBtn;
			$scope.showEditBtn = data.editBtn;
			$scope.subAssId = data.subAssId;
			if (operation == 'save') {
				$scope.formData = createOrEditEstimateService.generatePartName(subAssId);
			} else {
				$scope.formData = data.partObj;
			}
			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/createOrEditPartName.html',
				scope: $scope,
				size: 'md',
			});

		});
	}
	$scope.addPart = function (partData, subAssId) {
		createOrEditEstimateService.createPart(partData, subAssId, function () {
			$scope.getCurretEstimateObj();
			toastr.info('Part added successfully', 'Part Creation!');
			$scope.cancelModal();
		});
	}
	$scope.editPart = function () {
		$scope.getCurretEstimateObj();
		toastr.info('Part updated successfully', 'Part Updation!');
		$scope.cancelModal();

	}
	//- to add or edit part detail
	$scope.editPartItemDetails = function (subAssemblyId, partId) {
		$scope.getEstimateView('estimatePartItemDetail');
	}
	//- modal to confirm part deletion
	$scope.deletePartModal = function (getFunction, subAssemblyId, partId) {
		$scope.idToDelete = partId;
		$scope.functionToCall = getFunction;

		$scope.subAssemblyId = subAssemblyId;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/estimate/estimateModal/deletePartModal.html',
			scope: $scope,
			size: 'md'
		});
	}
	$scope.deletePart = function (subAssemblyId, partId) {
		createOrEditEstimateService.deletePart(subAssemblyId, partId, function () {
			toastr.info('Part deleted successfully', 'part Deletion!');
			$scope.getEstimateView('subAssembly');
			$scope.getCurretEstimateObj();
			$scope.cancelModal();
		});
	}
	//- function to delete multiple parts
	$scope.deleteMultipleParts = function (subAssId, partIds) {
		createOrEditEstimateService.deleteMultipleParts(subAssId, partIds, function () {
			$scope.bulkItems = [];
			$scope.checkAll = false;
			$scope.checkboxStatus = false;
			$scope.getEstimateView('subAssembly');
			$scope.getCurretEstimateObj();
			$scope.cancelModal();
			$scope.operationStatus = "***   Records deleted successfully   ***";

			$timeout(function () {
				$scope.operationStatus = "";
			}, 3000);
		});
	}
	//- modal to import Part
	$scope.importPartModal = function (subAssId) {
		$scope.subAssId = subAssId;
		createOrEditEstimateService.getAllPartNumbers(function (data) {
			$scope.partData = data;
			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/importPart.html',
				scope: $scope,
				size: 'md',
			});
		});
	}
	$scope.importPart = function (subAssId, partId) {
		createOrEditEstimateService.getImportPartData(subAssId, partId, function () {
			$scope.getCurretEstimateObj();
			toastr.info('Part imported successfully', 'Part Import!');
			$scope.cancelModal();
		});
	}
	//- to create a duplicate part for same subAssembly or different subAssembly
	$scope.duplicatePart = function (subAssId, part, option) {
		if (createOrEditEstimateService.getSubAssemblyIndex(subAssId) != -1) {
			$scope.message = '';
			createOrEditEstimateService.formDuplicatePart(subAssId, part, function () {
				if (option == 'import') {
					$scope.cancelModal();
				}
			});
		} else {
			$scope.message = 'Please Enter Valid SubAssembly Number';
		}
	}
	//- to import current part to  different subAssembly modal 
	$scope.importPartToDifferentSubAssemblyModal = function (part) {
		$scope.partData = part;
		createOrEditEstimateService.getAllSubAssNumbers(function (data) {
			$scope.subAssemblyData = data;
			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/importPartToDifferentSubAssemblyModal.html',
				scope: $scope,
				size: 'md'
			});
		});
	}


	//- to add processing at assembly or subssembly or at partLevel
	$scope.addProcessing = function (processingData, level, subAssemblyId, partId) {
		createOrEditEstimateService.createProcessing(processingData, level, subAssemblyId, partId, function () {
			$scope.getEstimateView('processing', level, subAssemblyId, partId);
			toastr.info('Processing added successfully', 'Processing Creation!');
			$scope.cancelModal();
		});
	}
	//- to edit processing at assembly or subssembly or at partLevel
	$scope.editProcessing = function () {
		$scope.getCurretEstimateObj();
		toastr.info('Processing updated successfully', 'Processing Updation!');
		$scope.cancelModal();
	}
	//- function to confirm delete Processings
	$scope.deleteProcessing = function (processingId, level, subAssemblyId, partId) {
		createOrEditEstimateService.deleteProcessing(processingId, level, subAssemblyId, partId, function (data) {
			toastr.info('Processing deleted successfully', 'Processing Deletion!');
			$scope.getEstimateView('processing', level, subAssemblyId, partId);
			$scope.cancelModal();
		});
	}
	//- fuction to delete bulk processing
	$scope.deleteMultipleProcessing = function (processingIds, level, subAssId, partId) {
		createOrEditEstimateService.deleteMultipleProcessing(level, processingIds, subAssId, partId, function () {
			$scope.bulkItems = [];
			$scope.checkAll = false;
			$scope.checkboxStatus = false;

			$scope.getEstimateView('processing', level, subAssId, partId);
			$scope.cancelModal();
			toastr.info('Processing deleted successfully', 'Processing Deletion!');
		});
	}
	//- Import Processing
	$scope.importProcessing = function (processingId, level, subAssemblyId, partId) {
		createOrEditEstimateService.getImportProcessingData(processingId, level, subAssemblyId, partId, function () {
			$scope.getCurretEstimateObj();
			toastr.info('Processing imported successfully', 'Processing Import!');
			$scope.cancelModal();
		});
	}


	//- to add Addon at assembly or subssembly or at partLevel
	$scope.addAddon = function (addonData, level, subAssemblyId, partId) {
		createOrEditEstimateService.createAddon(addonData, level, subAssemblyId, partId, function () {
			$scope.getEstimateView('addons', level, subAssemblyId, partId);
			toastr.info('Addon added successfully', 'Addon Creation!');
			$scope.cancelModal();
		});
	}
	//- to edit Addon at assembly or subssembly or at partLevel
	$scope.editAddon = function () {
		$scope.getCurretEstimateObj();
		toastr.info('Addon updated successfully', 'Addon Updation!');
		$scope.cancelModal();
	}
	//- function to confirm delete Addons
	$scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {
		createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function () {
			toastr.info('Addon deleted successfully', 'Addon Deletion!');
			$scope.getEstimateView('addons', level, subAssemblyId, partId);
			$scope.cancelModal();
		});
	}
	//- fuction to delete bulk addons
	$scope.deleteMultipleAddons = function (addonId, level, subAssId, partId) {
		createOrEditEstimateService.deleteMultipleAddons(level, addonId, subAssId, partId, function () {
			$scope.bulkItems = [];
			$scope.checkAll = false;
			$scope.checkboxStatus = false;
			$scope.getEstimateView('addons', level, subAssId, partId);
			$scope.cancelModal();
			toastr.info('Addons deleted successfully', 'Addons Deletion!');
		});
	}
	//- Import Addon
	$scope.importAddon = function (addonId, level, subAssemblyId, partId) {
		createOrEditEstimateService.getImportAddonData(addonId, level, subAssemblyId, partId, function () {
			$scope.getCurretEstimateObj();
			toastr.info('Addon imported successfully', 'Addon Import!');
			$scope.cancelModal();
		});
	}


	//- to add Extra at assembly or subssembly or at partLevel
	$scope.addExtra = function (extraData, level, subAssemblyId, partId) {
		createOrEditEstimateService.createExtra(extraData, level, subAssemblyId, partId, function () {
			$scope.getEstimateView('extras', level, subAssemblyId, partId);
			toastr.info('Extra added successfully', 'Extra Creation!');
			$scope.cancelModal();
		});
	}
	//- to edit Extra at assembly or subssembly or at partLevel
	$scope.editExtra = function () {
		$scope.getCurretEstimateObj();
		toastr.info('Extra updated successfully', 'Extra Updation!');
		$scope.cancelModal();
	}
	//- function to confirm delete Extras
	$scope.deleteExtra = function (extraId, level, subAssemblyId, partId) {
		createOrEditEstimateService.deleteExtra(extraId, level, subAssemblyId, partId, function () {
			toastr.info('Extra deleted successfully', 'Extra Deletion!');
			$scope.getEstimateView('extras', level, subAssemblyId, partId);
			$scope.cancelModal();
		});
	}
	//- fuction to delete bulk extras
	$scope.deleteMultipleExtras = function (extraId, level, subAssId, partId) {
		createOrEditEstimateService.deleteMultipleExtras(level, extraId, subAssId, partId, function () {
			$scope.bulkItems = [];
			$scope.checkAll = false;
			$scope.checkboxStatus = false;

			$scope.getEstimateView('extras', level, subAssId, partId);
			$scope.cancelModal();
			toastr.info('Extras deleted successfully', 'Extra Deletion!');
		});
	}
	//- Import Extra
	$scope.importExtra = function (extraId, level, subAssemblyId, partId) {
		createOrEditEstimateService.getImportExtraData(extraId, level, subAssemblyId, partId, function () {
			$scope.getCurretEstimateObj();
			toastr.info('Extra imported successfully', 'Extra Import!');
			$scope.cancelModal();
		});
	}


	//- modal to add or edit custom material 
	$scope.addOrEditCustomMaterialModal = function (operation, customMaterial) {
		$scope.arr = [];
		$scope.addMe = {};
		createOrEditEstimateService.getCustomMaterialModalData(operation, customMaterial, function (data) {

			$scope.formData = data.custMaterialObj;
			$scope.showSaveBtn = data.saveBtn;
			$scope.showEditBtn = data.editBtn;

			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/createOrEditCustomMaterial.html',
				scope: $scope,
				size: 'lg',
			});
		});


	}
	//- function to add or edit custom material
	$scope.addOrEditCustomMaterial = function (customMaterialdata) {
		customMaterialdata.hardFacingAlloys = $scope.hardFacingAlloys;
		createOrEditEstimateService.createCustomMaterial(customMaterialdata, function () {
			$scope.cancelModal();
		});
	}
	//- function to add hard facing alloy
	$scope.addHardFacingAlloy = function () {
		$scope.hardFacingAlloys.push($scope.addMe);
		$scope.addMe={};
	}
	//- modal to confirm delete custom material
	$scope.deleteCustomMaterialModal = function (customMaterialId, getFunction) {
		$scope.idToDelete = customMaterialId;
		$scope.functionToCall = getFunction;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
			scope: $scope,
			size: 'md'
		});
	}
	//- function to confirm delete CustomMterial
	$scope.deleteCustomMaterial = function () {}


	//- commmon add modal for processing, addons & extras    
	$scope.addItemModal = function (itemType, level, subAssemblyId, partId) {
		$scope.formData = undefined;
		$scope.showSaveBtn = true;
		$scope.showEditBtn = false;
		$scope.level = level;
		$scope.subAssemblyId = subAssemblyId;
		$scope.partId = partId;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/estimate/estimateModal/createOrEdit' + itemType + '.html',
			scope: $scope,
			size: 'md',
		});
	}
	//- commmon edit modal for processing, addons & extras
	$scope.editItemModal = function (itemType, extraObj) {
		$scope.formData = extraObj;
		$scope.showSaveBtn = false;
		$scope.showEditBtn = true;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/estimate/estimateModal/createOrEdit' + itemType + '.html',
			scope: $scope,
			size: 'md',
		});
	}
	//- commmon delete modal for processing, addons & extras
	$scope.deleteItemModal = function (getFunction, itemId, level, subAssemblyId, partId) {
		$scope.idToDelete = itemId;
		$scope.functionToCall = getFunction;
		$scope.level = level;
		$scope.subAssemblyId = subAssemblyId;
		$scope.partId = partId;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/estimate/estimateModal/deleteItemModal.html',
			scope: $scope,
			size: 'md'
		});
	}
	//- Common Import Item Modal for Processing, Addons & Extras
	$scope.importItemModal = function (type, level, subAssemblyId, partId) {
		$scope.itemId;
		$scope.level = level;
		$scope.subAssemblyId = subAssemblyId;
		$scope.partId = partId;
		createOrEditEstimateService.getAllItemNumbers(type, function (data) {
			$scope.itemData = data;
			$scope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/content/estimate/estimateModal/import' + type + '.html',
				scope: $scope,
				size: 'md',
			});
		});
	}
	//- common modal to confirm bulk items deletion
	$scope.deleteMultipleItemsModal = function (level, itemId, getFunction, subAssemblyId, partId) {
		$scope.idToDelete = itemId;
		$scope.functionToCall = getFunction;
		$scope.level = level;
		$scope.subAssemblyId = subAssemblyId;
		$scope.partId = partId;

		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/content/estimate/estimateModal/deleteMultipleItemsModal.html',
			scope: $scope,
			size: 'md'
		});
	}

	//- function to get bulk users
	$scope.selectBulkItems = function (checkboxStatus, itemId) {

		$scope.bulkItems;
		createOrEditEstimateService.selectBulkItems(checkboxStatus, itemId, function (data) {
			$scope.bulkItems = data;
		});
	}
	//- to select all records
	$scope.selectAll = function (type, level, itemData, checkboxStatus, subAssId, partId) {
		createOrEditEstimateService.selectAll(type, level, itemData, checkboxStatus, subAssId, partId, function (data) {
			$scope.bulkItems = data;
		});
	}


	//- dismiss current modalInstance
	$scope.cancelModal = function () {
		$scope.modalInstance.dismiss();
	}


	// *************************** init all default functions begin here ************** //
	//- to initilize the default function 
	$scope.init = function () {
		
		
		// to get default view
		$scope.getEstimateView('assembly');
		//to get estimate tree structure data 
		$scope.getEstimateData();
		$scope.getCustomMaterialData();
	}
	$scope.init();


});