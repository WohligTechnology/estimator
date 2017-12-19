myApp.controller('createOrEditEstimateCtrl', function ($scope, $state, toastr, $stateParams, createOrEditEstimateService, $uibModal) {

  // **************************************** default variables/tasks begin here **************************************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = false;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.bulkItems = []; //- for multiple deletion
  $scope.checkboxStatus = false; //- for multiple records selection
  $scope.checkAll = false; //- for all records selection
  $scope.hardFacingAlloys = []; //- for dynamic addition of Hard Facing Alloys
  $scope.changesCounter = 0; //- for save changes before redirecting

  $scope.estimatePartObj = {
    allShortcuts: [], //- get all presets name from API
    allPartTypes: [], //- get all part type from API
    allMaterial: [], //- get all material of selected partType
    allSizes: [], //- get data from selected preset

    selectedShortcut: {}, //- selected partType presets 
    selectedPartType: {}, //- selected partType
    selectedMaterial: {}, //- selected material     
    selectedSize: {}, //- slected size

    customMaterials: [], //- get all custom material from  API
    selectedCustomMaterial: {}, //- selecetd custom materail  

    quantity: 1, //- part.quantity
    variables: [], //- part.variables
    shapeImage: null, //- get it from slected partPreset --> shape.shapeImage      
    shapeIcon: null, //- get it from slected partPreset --> shape.shapeIcon
    processingCount: null, //- part.processing.length
    addonCount: null, //- part.addons.length
    extraCount: null, //- part.extars.length

    partName: null, //- part.partName
    scaleFactor: null, //- part.scaleFactor

    keyValueCalculations: {
      perimeter: null, //- part.keyValueCalculations.perimeter
      sheetMetalArea: null, //- part.keyValueCalculations.sheetMetalArea
      surfaceArea: null, //- part.keyValueCalculations.surfaceArea
      weight: null //- part.keyValueCalculations.weight
    },

    finalCalculation: {
      materialPrice: null, //- part.finalCalculation.materialPrice
      itemUnitPrice: null, //- part.finalCalculation.itemUnitPrice
      totalCostForQuantity: null //- part.finalCalculation.totalCostForQuantity
    },

    subAssNumber: "", //- to update part object of corresponding subAssembly
    partNumber: "" //- to update this part object
  };
  //- to enable & disable partType fields while creating/updating 
  $scope.disablePartFields = {
    disableField: true,
    disableShortcut: false,
    disablePartTypeName: false,
    disableMaterial: true,
    disableSize: true,
    disableCustomMaterial: false,
    displayPresetSize: false
  };




  if (angular.isDefined($stateParams.estimateId)) {
    $scope.draftEstimateId = $stateParams.estimateId;
  }

  // **************************************** default functions begin here  **************************************** //
  //- to get all views of createOrEdit estimate screen dynamically 
  $scope.getEstimateView = function (getViewName, getLevelName, subAssemblyId, partId) {

    createOrEditEstimateService.estimateView(getViewName, function (data) {
      $scope.estimateView = data;
    });

    createOrEditEstimateService.estimateViewData(getViewName, getLevelName, subAssemblyId, partId, function (data) {
      if (getViewName == 'editPartItemDetail' || getViewName == 'partDetail') {
        
        $scope.estimatePartObj.allShortcuts = data.allShortcuts;
        $scope.estimatePartObj.allPartTypes = data.allPartTypes;
        $scope.estimatePartObj.subAssNumber = data.subAssNumber;
        $scope.estimatePartObj.partNumber = data.partNumber;


        //- here data.partUpdateStatus will be true when admin will update all part calculation data
        //- so, we can get all the data from formData.assembly of createOrEditEstimateService & bind it with  $scope.estimatePartObj
        if (data.partUpdateStatus) {
          $scope.estimatePartObj.allMaterial = data.selectedPartType.material;
          // $scope.estimatePartObj.allSizes = data.allShortcuts;
          $scope.estimatePartObj.selectedShortcut = data.selectedShortcut;
          $scope.estimatePartObj.selectedPartType = data.selectedPartType;
          $scope.estimatePartObj.selectedMaterial = data.selectedMaterial;
          $scope.estimatePartObj.selectedSize = data.selectedSize;
          $scope.disablePartFields.displayPresetSize = true;
          $scope.disablePartFields.disableCustomMaterial = true;

          $scope.estimatePartObj.customMaterials = data.customMaterials;
          $scope.estimatePartObj.selectedCustomMaterial = data.selectedCustomMaterial;

          if (data.quantity) {
            $scope.estimatePartObj.quantity = data.quantity;
          } else {
            $scope.estimatePartObj.quantity = 1;
          }

          $scope.estimatePartObj.variables = data.variable;
          $scope.estimatePartObj.shapeImage = data.shapeImage;
          $scope.estimatePartObj.shapeIcon = data.shapeIcon;
          $scope.estimatePartObj.processingCount = data.processingCount;
          $scope.estimatePartObj.addonCount = data.addonCount;
          $scope.estimatePartObj.extraCount = data.extraCount;
          $scope.estimatePartObj.partName = data.partName;
          $scope.estimatePartObj.scaleFactor = data.scaleFactor;

          $scope.estimatePartObj.keyValueCalculations.perimeter = data.keyValueCalculations.perimeter;
          $scope.estimatePartObj.keyValueCalculations.sheetMetalArea = data.keyValueCalculations.sheetMetalArea;
          $scope.estimatePartObj.keyValueCalculations.surfaceArea = data.keyValueCalculations.surfaceArea;
          $scope.estimatePartObj.keyValueCalculations.weight = data.keyValueCalculations.weight;

          $scope.estimatePartObj.finalCalculation.materialPrice = data.finalCalculation.materialPrice;
          $scope.estimatePartObj.finalCalculation.itemUnitPrice = data.finalCalculation.itemUnitPrice;
          $scope.estimatePartObj.finalCalculation.totalCostForQuantity = data.finalCalculation.totalCostForQuantity;

        }

      } else {
        
        $scope.level = getLevelName;
        $scope.estimateViewData = data;
        $scope.bulkItems = [];
      }
    });
  }

  //- =================== part functionality/calculation start =================== //

  //- call when user will select shortcut/preset name 
  //- update dependent data on the base of  selected shortcut data
  $scope.getSelectedShortcutData = function (shortcutObj, partTypes) {

    //- update selectedShortcut
    //- get part type (update selectedPartType) & disable it
    //- get material data to select 
    //- get size & disable it
    //- custom material --> disable it
    //- get shape data from selected shortcut (i.e part presetName)
    //- update variable [] --> put variables of shape into an variable[] of estimatePartObj.variables

    $scope.estimatePartObj.selectedShortcut = shortcutObj;
    $scope.estimatePartObj.selectedPartType = shortcutObj.partType;
    $scope.estimatePartObj.allMaterial = $scope.estimatePartObj.selectedPartType.material;
    $scope.estimatePartObj.selectedSize = shortcutObj.size;

    //- update shape related data
    $scope.estimatePartObj.variables = shortcutObj.variable;
    $scope.estimatePartObj.keyValueCalculations.perimeter = shortcutObj.partFormulae.perimeter;
    $scope.estimatePartObj.keyValueCalculations.sheetMetalArea = shortcutObj.partFormulae.sheetMetalArea;
    $scope.estimatePartObj.keyValueCalculations.surfaceArea = shortcutObj.partFormulae.surfaceArea;
    $scope.estimatePartObj.keyValueCalculations.weight = shortcutObj.partFormulae.weight;
    $scope.estimatePartObj.shapeIcon = shortcutObj.shape.icon;
    $scope.estimatePartObj.shapeImage = shortcutObj.shape.image;

    //- update PAE count
    // $scope.estimatePartObj.processingCount = part.processing.length; /////-
    // $scope.estimatePartObj.addonCount = part.addons.length; /////-
    // $scope.estimatePartObj.extraCount = part.extras.length; /////-

    //- disable fields
    $scope.disablePartFields.disablePartType = true;
    $scope.disablePartFields.disableMaterial = false;
    $scope.disablePartFields.disableSize = true;
    $scope.disablePartFields.disableCustomMaterial = true;
    $scope.disablePartFields.displayPresetSize = true;

  }

  //- call when user will select part type name 
  //- update dependent data on the base of selected part type data
  $scope.getSelectedPartTypeData = function (partTypeObj) {

    //- all shortcuts data is already there (so, don't  update it corresponding to selected part Type), let user select size to get shortcut
    //- get all materials (corresponding to selected part Type) data to select 
    //- get/update all sizes (corresponding to selected part Type) data to select
    //- custom material --> disable it 

    //- $scope.estimatePartObj.allShortcuts = allShortcuts;      /////-  
    $scope.estimatePartObj.selectedPartType = selectedPartType; /////-
    $scope.estimatePartObj.allMaterial = allMaterial; /////-
    $scope.estimatePartObj.allSizes = allSizes; /////-

    //- disable fields
    $scope.disablePartFields.disableCustomMaterial = true;

  }

  //- call when user will select material (only in case of either shortcut OR part type is selected)
  //- update dependent data on the base of selcted material data
  $scope.getSelectedMaterialData = function (materialObj) {
    $scope.estimatePartObj.selectedMaterial = materialObj;

    if ($scope.isAllselected()) {
      $scope.getPartFinalCalculation();
    }

  }

  //- call when user will select size (only in case when user selected part type)
  //- update dependent data on the base of selected size data
  $scope.getSelectedSizeData = function (size) {
    //- get shortcut corresponding to the selected partType & size
    //- get all material data to select 
    //- get shape data from selected partType & size 
    //- update variable [] --> put variables of shape into an variable[] of estimatePartObj.variables

    $scope.estimatePartObj.selectedShortcut = shortcutObj; /////-

    //- update shape related data
    $scope.estimatePartObj.variables = shapeData.variables; /////-
    $scope.estimatePartObj.keyValueCalculations.perimeter = shapeData.perimeter; /////-
    $scope.estimatePartObj.keyValueCalculations.sma = shapeData.sma; /////-
    $scope.estimatePartObj.keyValueCalculations.sa = shapeData.sa; /////-
    $scope.estimatePartObj.keyValueCalculations.weight = shapeData.weight; /////-

  }

  $scope.updatePartCalculation = function () {
    console.log('**** inside updatePartCalculation of createOrEditEstimateCtrl.js ****');

    //- get shape formulae
    //- get updated variables 
    //- calculate keyValueCalculations & finalCalculation 
    //- update estimate object --> variable array
    
    var partFormulae = $scope.estimatePartObj.selectedShortcut.shape.partFormulae;

    _.map($scope.estimatePartObj.variables, function (n) {
      varName = n.varName;
      varValue = parseInt(n.varValue);

      tempVar = varName;
      window[tempVar] = varValue;
    });

    $scope.estimatePartObj.keyValueCalculations.perimeter = eval(partFormulae.perimeter);
    $scope.estimatePartObj.keyValueCalculations.sheetMetalArea = eval(partFormulae.sheetMetalArea);
    $scope.estimatePartObj.keyValueCalculations.surfaceArea = eval(partFormulae.surfaceArea);
    $scope.estimatePartObj.keyValueCalculations.weight = eval(partFormulae.weight);
    $scope.getPartFinalCalculation();
  }

  $scope.getPartFinalCalculation = function () {
    //- get all updated variable data & calculate all keyValueCalculations i.e. perimeter, sheetMetalArea, surfaceArea, weight
    //- also calculate all finalCalculation i.e. materialPrice, itemUnitPrice, totalCostForQuantity  

    $scope.estimatePartObj.finalCalculation.materialPrice = $scope.estimatePartObj.selectedMaterial.typicalRatePerKg;
    $scope.estimatePartObj.finalCalculation.itemUnitPrice = $scope.estimatePartObj.keyValueCalculations.weight * $scope.estimatePartObj.selectedMaterial.typicalRatePerKg;
    $scope.estimatePartObj.finalCalculation.totalCostForQuantity = $scope.estimatePartObj.quantity * $scope.estimatePartObj.finalCalculation.itemUnitPrice;

  }

  $scope.isAllselected = function () {
    if ($scope.estimatePartObj.selectedShortcut != {} && $scope.estimatePartObj.selectedShortcut != undefined) {
      if ($scope.estimatePartObj.selectedPartType && $scope.estimatePartObj.selectedPartType != undefined) {
        if ($scope.estimatePartObj.selectedMaterial && $scope.estimatePartObj.selectedMaterial != undefined) {
          if ($scope.estimatePartObj.selectedSize && $scope.estimatePartObj.selectedSize != undefined) {
            return true;
          }
        }
      }
    }

  }

  //- to update part calculation detail into an corresponding part 
  $scope.updatePartDetail = function (partObject) {
    createOrEditEstimateService.updatePartDetail(partObject, function (data) {
      $scope.estimteData = data;
    });
  }


  //- =================== part functionality/calculation end =================== //


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
  //- save estimate object in jStorage
  // $scope.$watch('estimteData', function (newValue, oldValue) {
  //   if (newValue != oldValue) {
  //     // $.jStorage.set("estimateObject", $scope.estimteData);
  //   }
  // }, true);

  //- to alert user before refreshing the page
  $scope.$watch('estimteData', function (newValue, oldValue) {
    if (oldValue != undefined) {
      if (newValue != oldValue) {
        $scope.changesCounter += 1;
      }
    }
  }, true);

  //- to ask user to save changes before redirecting
  $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    if (fromState.name == 'app.createEstimate' && $scope.changesCounter > '0') {
      var answer = window.confirm('Please Save Your Changes !!!');
      if (answer) {
        event.preventDefault();
      }
    }
  });
  window.onbeforeunload = function (event) {
    if ($scope.changesCounter > '0') {
      return 'Are you sure you want to reload?'
    }
  };

  // **************************************** functions to be triggered form view begin here **************************************** //
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
  //- to edit assembly name
  $scope.editAssemblyName = function (assemblyName) {
    createOrEditEstimateService.editAssemblyName(assemblyName, $scope.draftEstimateId, function (data) {
      $scope.changesCounter = 0;
      $scope.getEstimateData();
      $scope.cancelModal();
      toastr.success('Estimate data updated successfully');
    });
  }
  //- to update estimate object in draftEstimate table
  $scope.saveCurrentEstimate = function () {
    $scope.changesCounter = 0;
    createOrEditEstimateService.saveCurrentEstimate(function (data) {
      $scope.getEstimateData();
      toastr.info('Estimate data updated successfully');
    });
  }
  //- import subAssembly modal
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


  //- to add or edit subAssembly data modal
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
  //- to add subAssembly data
  $scope.addSubAssembly = function (subAssemblyData) {

    createOrEditEstimateService.createSubAssembly(subAssemblyData, function () {
      $scope.getCurretEstimateObj();
      $scope.cancelModal();
      toastr.success('SubAssembly added successfully');
    });
  }
  //- to edit subAssembly data
  $scope.editSubAssembly = function (number) {
    $scope.getCurretEstimateObj();
    $scope.cancelModal();
    toastr.success('SubAssembly Name Edited successfully');
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
  //- to delete subAssembly
  $scope.deleteSubAssembly = function (subAssemblyId) {
    createOrEditEstimateService.deleteSubAssembly(subAssemblyId, function () {
      toastr.info('SubAssembly deleted successfully');
      $scope.getEstimateView('assembly');
      $scope.cancelModal();
    });
  }
  //- to delete bulk subAssemblies
  $scope.deleteMultipleSubAssemblies = function (subAssIds) {
    createOrEditEstimateService.deleteMultipleSubAssemblies(subAssIds, function () {
      $scope.bulkItems = [];
      $scope.checkAll = false;
      $scope.checkboxStatus = false;

      $scope.getEstimateView('assembly');
      $scope.cancelModal();
      toastr.info('SubAssemblies deleted successfully');
    });
  }
  //- import subAssembly modal
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
  //- to import subAssembly
  $scope.importSubAssembly = function (subAssId) {
    createOrEditEstimateService.getImportSubAssemblyData(subAssId, function () {
      $scope.getCurretEstimateObj();
      toastr.info('SubAssembly imported successfully');
      $scope.cancelModal();
    });
  }


  //- to add or edit part data modal
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
  //- to add part data
  $scope.addPart = function (partData, subAssId) {
    createOrEditEstimateService.createPart(partData, subAssId, function () {
      $scope.getCurretEstimateObj();
      toastr.info('Part added successfully', 'Part Creation!');
      $scope.cancelModal();
    });
  }
  //- to edit part data 
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
  //- to  delete part
  $scope.deletePart = function (subAssemblyId, partId) {
    createOrEditEstimateService.deletePart(subAssemblyId, partId, function () {
      toastr.success('Part deleted successfully');
      $scope.getEstimateView('subAssembly');
      $scope.getCurretEstimateObj();
      $scope.cancelModal();
    });
  }
  //- to delete multiple parts
  $scope.deleteMultipleParts = function (subAssId, partIds) {
    createOrEditEstimateService.deleteMultipleParts(subAssId, partIds, function () {
      $scope.bulkItems = [];
      $scope.checkAll = false;
      $scope.checkboxStatus = false;
      $scope.getEstimateView('subAssembly');
      $scope.getCurretEstimateObj();
      $scope.cancelModal();
      toastr.success('Parts deleted successfully');
      // $scope.operationStatus = "***   Records deleted successfully   ***";

      // $timeout(function () {
      // 	$scope.operationStatus = "";
      // }, 3000);
    });
  }
  //- import part modal
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
  //- to import part
  $scope.importPart = function (subAssId, partId) {
    createOrEditEstimateService.getImportPartData(subAssId, partId, function () {
      $scope.getCurretEstimateObj();
      toastr.info('Part imported successfully');
      $scope.cancelModal();
    });
  }
  //- to create a duplicate part for same subAssembly or different subAssembly
  $scope.duplicatePart = function (subAssId, part, option) {
    if (createOrEditEstimateService.getSubAssemblyIndex(subAssId) != -1) {
      //$scope.message = '';
      createOrEditEstimateService.formDuplicatePart(subAssId, part, function () {
        if (option == 'import') {
          $scope.cancelModal();
        }
        toastr.success('Part added successfully');
      });
    } else {
      toastr.warning('Please Enter Valid SubAssembly Number');
    }
  }
  //- to import current part to  different subAssembly 
  $scope.importPartToDifferentSubAssemblyModal = function (subAssNumber, part) {
    $scope.partData = part;
    createOrEditEstimateService.getAllSubAssNumbers(subAssNumber, function (data) {
      if (_.isEmpty(data)) {
        toastr.warning('No SubAssemblies are available to import');
      } else {
        $scope.subAssemblyData = data;
        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/importPartToDifferentSubAssemblyModal.html',
          scope: $scope,
          size: 'md'
        });
      }
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
  //- delete addon
  $scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function () {
      toastr.info('Addon deleted successfully', 'Addon Deletion!');
      $scope.getEstimateView('addons', level, subAssemblyId, partId);
      $scope.cancelModal();
    });
  }
  //- to delete bulk addons
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
  //- to delete Extra
  $scope.deleteExtra = function (extraId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteExtra(extraId, level, subAssemblyId, partId, function () {
      toastr.info('Extra deleted successfully', 'Extra Deletion!');
      $scope.getEstimateView('extras', level, subAssemblyId, partId);
      $scope.cancelModal();
    });
  }
  //- to delete bulk extras
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
      toastr.info('Extra imported successfully');
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
  //- to add or edit custom material
  $scope.addOrEditCustomMaterial = function (customMaterialdata) {
    customMaterialdata.hardFacingAlloys = $scope.hardFacingAlloys;
    createOrEditEstimateService.createCustomMaterial(customMaterialdata, function () {
      $scope.cancelModal();
    });
  }
  //-to add hard facing alloy
  $scope.addHardFacingAlloy = function () {
    $scope.hardFacingAlloys.push($scope.addMe);
    $scope.addMe = {};
  }
  //- modal to delete custom material
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
  //-to delete CustomMterial
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

    if (itemType == 'Processing') {
      // get part type data
      // get part item data

      createOrEditEstimateService.getProcessingData(function (data) {
        $scope.partProcessingObj.processingTypeData = data.processingTypeData;
      });

    } else if (itemType == 'addons') {
      // get addon type data
      // get addon item data

      createOrEditEstimateService.getAddoneData(function (data) {
        $scope.addonTypeData = data;
      });

    } else if (itemType == 'extras') {
      // get extra data
      createOrEditEstimateService.getExtraData(function (data) {
        $scope.partTypeData = data;
      });
    }
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


  //- ==================================== processing functionality/calculation start ==================================== //



  $scope.clearPartProcessingObj = function () {
    $scope.partProcessingObj = {
      processingTypeData: [],
      processingItemData: [],
      selectedProcessingType: {},
      selectedProcessingItem: {},
      rate: {
        actualRate: null,
        uom: ""
      },
      quantity: {
        linkedKeyValue: {
          keyVariable: null,
          keyValue: null
        },
        totalQuantity: 1,
        utilization: 100,
        contengncyOrWastage: 10
      },
      remark: "",
      totalCost: null,
      finalUom: null,
      linkedKeyValuesCalculation: {
        perimeter: null,
        sheetMetalArea: null,
        surfaceArea: null,
        weight: null
      }
    };
  }
  $scope.clearPartProcessingObj();

  $scope.disableProcessingFields = {
    disableProcessItem: true,
  };

  $scope.addOrEditProcessingModal = function (operation, level, subAssemblyId, partId, processingId) {
    $scope.clearPartProcessingObj();

    $scope.level = level;
    $scope.subAssemblyId = subAssemblyId;
    $scope.partId = partId;

    //- get required data to add processing
    createOrEditEstimateService.getProcessingModalData(operation, level, subAssemblyId, partId, processingId, function (data) {
      if (operation == 'save') {
        //- get required data to add processing
        $scope.partProcessingObj.processingTypeData = data.processingTypeData;
      } else if ('update') {
        $scope.partProcessingObj.processingTypeData = data.processingTypeData;
        $scope.partProcessingObj.processingItemData = data.processingItemData;
        $scope.partProcessingObj.selectedProcessingType = data.selectedProcessingType;
        $scope.partProcessingObj.selectedProcessingItem = data.selectedProcessingItem;

        $scope.partProcessingObj.rate.actualRate = data.rate.actualRate;
        $scope.partProcessingObj.rate.uom = data.selectedProcessingType.rate.uom.uomName;

        $scope.partProcessingObj.quantity.linkedKeyValue.keyVariable = data.quantity.linkedKeyValue.keyVariable;
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = data.quantity.linkedKeyValue.keyValue;
        $scope.partProcessingObj.quantity.utilization = data.quantity.utilization;
        $scope.partProcessingObj.quantity.contengncyOrWastage = data.quantity.contengncyOrWastage;
        $scope.partProcessingObj.quantity.totalQuantity = data.quantity.totalQuantity;

        $scope.partProcessingObj.finalUom = data.finalUom;
        $scope.partProcessingObj.remark = data.remark;
        $scope.partProcessingObj.currentPartObj = data.currentPartObj;
        $scope.partProcessingObj.processingNumber = data.processingNumber;

        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;
      }

      //- get linkedKeyValuesAtPartCalculation objet from service
      if (level == 'part') {
        $scope.partProcessingObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtPartCalculation;
      } else if (level == 'subAssembly') {
        $scope.partProcessingObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtSubAssemblyCalculation;
      } else if (level == 'assembly') {
        $scope.partProcessingObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtAssemblyCalculation;
      }

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/estimate/estimateModal/createOrEditProcessing.html',
        scope: $scope,
        size: 'md',
      });

    });


  }

  //- call when user will select a processType 
  //- get all process Item of corrresponding processType
  //- get done with all calculation dependent on processTYpe
  $scope.getSelectedProessType = function (proTypeObj) {  
    createOrEditEstimateService.getSelectedProessType(proTypeObj._id, function (data) {
      $scope.disableProcessingFields.disableProcessItem = false;
      $scope.partProcessingObj.processingItemData = data;
      $scope.partProcessingObj.quantity.linkedKeyValue.keyVariable = "";
      $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = "";

      //- get the value of selected linkedKeyValue of processType from part --> keyValueCalculation --> selected linkedKeyValue   

      var tempLinkedKeyValue = $scope.partProcessingObj.selectedProcessingType.quantity.linkedKeyValue;
      $scope.partProcessingObj.quantity.linkedKeyValue.keyVariable = tempLinkedKeyValue;

      if (tempLinkedKeyValue == "Perimeter") {
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = parseFloat($scope.partProcessingObj.linkedKeyValuesCalculation.perimeter) * parseFloat($scope.partProcessingObj.selectedProcessingType.quantity.mulfact);
      } else if (tempLinkedKeyValue == "SMA") {
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = parseFloat($scope.partProcessingObj.linkedKeyValuesCalculation.SMA) * parseFloat($scope.partProcessingObj.selectedProcessingType.quantity.mulfact);
      } else if (tempLinkedKeyValue == "SA") {
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = parseFloat($scope.partProcessingObj.linkedKeyValuesCalculation.SA) * parseFloat($scope.partProcessingObj.selectedProcessingType.quantity.mulfact);
      } else if (tempLinkedKeyValue == "Wt") {
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = parseFloat($scope.partProcessingObj.linkedKeyValuesCalculation.Wt) * parseFloat($scope.partProcessingObj.selectedProcessingType.quantity.mulfact);
      } else if (tempLinkedKeyValue == "Nos") {
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = parseFloat($scope.partProcessingObj.linkedKeyValuesCalculation.Nos) * parseFloat($scope.partProcessingObj.selectedProcessingType.quantity.mulfact);
      } else if (tempLinkedKeyValue == "Hrs") {
        $scope.partProcessingObj.quantity.linkedKeyValue.keyValue = parseFloat($scope.partProcessingObj.linkedKeyValuesCalculation.Hrs) * parseFloat($scope.partProcessingObj.selectedProcessingType.quantity.mulfact);
      }

      $scope.partProcessingObj.finalUom = $scope.partProcessingObj.selectedProcessingType.quantity.finalUom.uomName;
      // $scope.partProcessingObj.totalCost = $scope.partProcessingObj.selectedProcessingType.quantity.totalQuantity * $scope.partProcessingObj.rate;

    });
  }

  //- call when user will select a processItem
  //- get done with all the calculation after selecting processItem
  $scope.getSelectedProessItem = function (proItemObj) {
    //- calculate rate
    $scope.partProcessingObj.rate.actualRate = parseFloat($scope.partProcessingObj.selectedProcessingType.rate.mulFact) * parseFloat($scope.partProcessingObj.selectedProcessingItem.rate);
    $scope.partProcessingObj.rate.uom = $scope.partProcessingObj.selectedProcessingType.rate.uom.uomName;

  }

  //- to add processing at assembly or subssembly or at partLevel
  $scope.addProcessing = function (operation, processingData, level, subAssemblyId, partId) {
    //- make processingData properly & then pass it to createProcessing
    //- set object same as processing object in service
    var processing = {
      processingNumber: processingData.processingNumber,
      processType: processingData.selectedProcessingType,
      processItem: processingData.selectedProcessingItem,
      rate: processingData.rate.actualRate,
      quantity: {
        linkedKeyValue: {
          keyVariable: processingData.quantity.linkedKeyValue.keyVariable,
          keyValue: processingData.quantity.linkedKeyValue.keyValue
        },
        totalQuantity: processingData.quantity.totalQuantity,
        utilization: processingData.quantity.utilization,
        contengncyOrWastage: processingData.quantity.contengncyOrWastage
      },
      remark: processingData.remark,
      totalCost: processingData.totalCost

    };

    if (operation == 'save') {
      createOrEditEstimateService.createProcessing(processing, level, subAssemblyId, partId, function () {
        $scope.getEstimateView('processing', level, subAssemblyId, partId);
        toastr.info('Processing added successfully', 'Processing Creation!');
        $scope.cancelModal();
      });
    } else if (operation == 'update') {
      
      createOrEditEstimateService.updateProcessing(processing, level, subAssemblyId, partId, function () {
        $scope.getEstimateView('processing', level, subAssemblyId, partId);
        toastr.info('Processing updated successfully', 'Processing Creation!');
        $scope.cancelModal();
      });
    }


  }
  //- to edit processing at assembly or subssembly or at partLevel
  $scope.editProcessing = function () {
    $scope.getCurretEstimateObj();
    toastr.info('Processing updated successfully', 'Processing Updation!');
    $scope.cancelModal();
  }
  //- to delete processing
  $scope.deleteProcessing = function (processingId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteProcessing(processingId, level, subAssemblyId, partId, function (data) {
      toastr.info('Processing deleted successfully', 'Processing Deletion!');
      $scope.getEstimateView('processing', level, subAssemblyId, partId);
      $scope.cancelModal();
    });
  }
  //- to delete bulk processing
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
  //- import processing
  $scope.importProcessing = function (processingId, level, subAssemblyId, partId) {
    createOrEditEstimateService.getImportProcessingData(processingId, level, subAssemblyId, partId, function () {
      $scope.getCurretEstimateObj();
      toastr.info('Processing imported successfully', 'Processing Import!');
      $scope.cancelModal();
    });
  }


  //- ==================================== processing functionality/calculation end ==================================== //


  //- function to get bulk processing, addons & extras
  $scope.selectBulkItems = function (checkboxStatus, itemId) {
    $scope.bulkItems;
    createOrEditEstimateService.selectBulkItems(checkboxStatus, itemId, function (data) {
      $scope.bulkItems = data;
    });
  }
  //- to select all records of processing/addons/extras
  $scope.selectAll = function (type, level, itemData, checkboxStatus, subAssId, partId) {
    createOrEditEstimateService.selectAll(type, level, itemData, checkboxStatus, subAssId, partId, function (data) {
      $scope.bulkItems = data;
    });
  }

  //- dismiss current modalInstance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }


  // **************************************** init all default functions begin here **************************************** //
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