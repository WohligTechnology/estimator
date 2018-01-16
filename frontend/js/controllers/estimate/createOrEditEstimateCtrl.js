myApp.controller('createOrEditEstimateCtrl', function ($scope, $state, toastr, $stateParams, createOrEditEstimateService, $uibModal) {

  // **************************************** default variables/tasks begin here **************************************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = false;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.bulkItems = []; //- for multiple deletion
  $scope.checkboxStatus = false; //- for multiple records selection
  $scope.checkAll = false; //- for all records selectione
  $scope.hardFacingAlloys = []; //- for dynamic addition of Hard Facing Alloys
  $scope.changesCounter = 0; //- for save changes before redirecting

  $scope.estimatePartObj = {
    allShortcuts: [], //- get all presets name from API
    allPartTypes: [], //- get all part type from API
    allMaterial: [], //- get all material of selected partType
    allSizes: [], //- get data from selected preset
    allShapes: [], //- get all shapes after selecting custom material

    selectedShortcut: {}, //- selected partType presets 
    selectedPartType: {}, //- selected partType 
    selectedMaterial: {}, //- selected material     
    selectedSize: {}, //- slected size 

    customMaterials: [], //- get all custom material from  API
    selectedCustomMaterial: {}, //- selecetd custom materail  
    selectedShape: {}, //- seleceted shape after selecting custom material or separate shape

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

    formFactor: "",
    length: "",
    sizeFactor: "",
    thickness: "",
    wastage: "",

    partUpdateStatus: false,

    subAssNumber: "", //- to update part object of corresponding subAssembly
    partNumber: "" //- to update this part object
  };
  $scope.estimatePartObjTemp = _.cloneDeep($scope.estimatePartObj);
  //- to enable & disable partType fields while creating/updating 
  $scope.disablePartFields = {
    disableField: true,
    disableShortcut: false,
    disablePartTypeName: false,
    disableMaterial: true,
    disableSize: true,
    disableCustomMaterial: true,
    displayPresetSize: false,
    disableShape: false,
    disableAllMaterial: true,
    showAll: true
  };
  $scope.disablePartFieldsTemp = _.cloneDeep($scope.disablePartFields);




  if (angular.isDefined($stateParams.estimateId)) {
    $scope.draftEstimateId = $stateParams.estimateId;
  }

  // **************************************** default functions begin here  **************************************** //
  //- to get all views of createOrEdit estimate screen dynamically 
  $scope.getEstimateView = function (getViewName, getLevelName, subAssemblyId, partId) {
    createOrEditEstimateService.estimateView(getViewName, getLevelName, subAssemblyId, partId, function (data) {
      if (data == 'restrictUser') {
        toastr.warning('You cannot access it now');
      } else {
        $scope.estimateView = data;
        //when first time user click item details of part
        $scope.estimatePartObj = _.cloneDeep($scope.estimatePartObjTemp);
        $scope.disablePartFields = _.cloneDeep($scope.disablePartFieldsTemp);

        createOrEditEstimateService.estimateViewData(getViewName, getLevelName, subAssemblyId, partId, function (data) {
          if (getViewName == 'editPartItemDetail' || getViewName == 'partDetail') {
            //- get all processing count, addon count & extras count
            //- get all shortcuts, all part types, all shapes, all custom materials
            //- get subAss, part name and part number
            $scope.estimatePartObj.processingCount = data.processingCount;
            $scope.estimatePartObj.addonCount = data.addonCount;
            $scope.estimatePartObj.extraCount = data.extraCount;

            $scope.estimatePartObj.allShortcuts = data.allShortcuts;
            $scope.estimatePartObj.allPartTypes = data.allPartTypes;
            $scope.estimatePartObj.allShapes = data.allShapes;
            $scope.estimatePartObj.customMaterials = data.customMaterials;

            $scope.estimatePartObj.subAssNumber = data.subAssNumber;
            $scope.estimatePartObj.partNumber = data.partNumber;
            $scope.estimatePartObj.partName = data.partName;

            $scope.estimatePartObj.partUpdateStatus = data.partUpdateStatus;

            //- here data.partUpdateStatus will be true when admin will update all part calculation data
            //- so, we can get all the data from formData.assembly of createOrEditEstimateService & bind it with  $scope.estimatePartObj
            if (data.partUpdateStatus) {
              //- enable save/update buttons
              $scope.showSaveBtn = false;
              $scope.showEditBtn = true;

              $scope.estimatePartObj.formFactor = data.formFactor; //- formFactor
              $scope.estimatePartObj.length = data.length; //- length
              $scope.estimatePartObj.sizeFactor = data.sizeFactor; //- sizeFactor
              $scope.estimatePartObj.thickness = data.thickness; //- thickness
              $scope.estimatePartObj.wastage = data.wastage; //- wastage

              //- get selected shape data
              $scope.estimatePartObj.selectedShape = data.selectedShape;
              // $scope.estimatePartObj.allSizes = data.allShortcuts;
              //- if shortCut is selected 
              //- get sleceted shortcut, selected part type , selected size, selected material and all materials of respectinve part type
              //- disable size 
              //- hide shape
              if (angular.isDefined(data.selectedShortcut._id)) {
                $scope.estimatePartObj.selectedShortcut = data.selectedShortcut;
                $scope.estimatePartObj.selectedPartType = data.selectedPartType;
                $scope.estimatePartObj.allMaterial = data.selectedPartType.material;
                $scope.estimatePartObj.selectedMaterial = data.selectedMaterial;
                $scope.estimatePartObj.selectedSize = data.selectedSize;

                $scope.disablePartFields.displayPresetSize = true;
                $scope.disablePartFields.disableShape = true;
              } else if (angular.isDefined(data.selectedCustomMaterial._id)) {

                //- if custom material is selected
                //- enable custom material field
                //- hide shortcut, part type, size
                //- to get all available materials
                $scope.estimatePartObj.selectedCustomMaterial = data.selectedCustomMaterial;
                $scope.disablePartFields.showAll = false;
                $scope.disablePartFields.disableCustomMaterial = false;
              } else { //- if material is selected
                //- hide custom material
                //- enable material field
                //- get selected materials
                //- hide shortcut, part type, size
                //- to get all available materials
                $scope.disablePartFields.disableCustomMaterial = true;
                $scope.disablePartFields.disableAllMaterial = false;
                $scope.disablePartFields.showAll = false;

                $scope.estimatePartObj.selectedMaterial = data.selectedMaterial;
                createOrEditEstimateService.getAllMaterials(function (data) {
                  $scope.estimatePartObj.allMaterial = data;
                });
              }

              if (data.quantity) {
                $scope.estimatePartObj.quantity = data.quantity;
              } else {
                $scope.estimatePartObj.quantity = 1;
              }

              $scope.estimatePartObj.variables = data.variable;
              $scope.estimatePartObj.shapeImage = data.shapeImage;
              $scope.estimatePartObj.shapeIcon = data.shapeIcon;
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
    });
  }
  //- to perform CRUD of custom material
  $scope.getAllMaterialData = function (getViewName) {
    createOrEditEstimateService.getAllMaterialData(function (data) {
      $scope.customMaterial = data;
      if (getViewName == "customMaterial") {
        $scope.estimateView = "views/content/estimate/estimateViews/customMaterial.html";
        $scope.estimateViewData = data;
      }
    });
  }
  //- =================== part functionality/calculation start =================== //

  //- call when user will select shortcut/preset name 
  //- update dependent data on the base of  selected shortcut data
  $scope.getSelectedShortcutData = function (shortcutObj) {
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
    $scope.estimatePartObj.selectedShape = shortcutObj.shape;

    //- update shape related data
    $scope.estimatePartObj.formFactor = shortcutObj.formFactor;
    $scope.estimatePartObj.length = shortcutObj.length;
    $scope.estimatePartObj.sizeFactor = shortcutObj.sizeFactor;
    $scope.estimatePartObj.thickness = shortcutObj.thickness;
    $scope.estimatePartObj.wastage = shortcutObj.wastage;

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
    $scope.disablePartFields.displayPresetSize = true;
    $scope.disablePartFields.disableShape = true;

  }

  //- call when user will select part type name 
  //- update dependent data on the base of selected part type data
  $scope.getSelectedPartTypeData = function (partTypeObj) {
    //- all shortcuts data is already there (so, don't  update it corresponding to selected part Type), let user select size to get shortcut
    //- get all materials (corresponding to selected part Type) data to select 
    //- get/update all sizes (corresponding to selected part Type) data to select
    //- custom material --> disable it 
    //- shape --> disable it
    createOrEditEstimateService.getSelectedPartTypeData(partTypeObj._id, function (data) {
      $scope.estimatePartObj.allSizes = data; /////-
    });
    //- $scope.estimatePartObj.allShortcuts = allShortcuts;      /////-  
    $scope.estimatePartObj.selectedPartType = partTypeObj; /////-
    $scope.estimatePartObj.allMaterial = partTypeObj.material; /////-

    //- disable fields
    $scope.disablePartFields.disableMaterial = false;
    $scope.disablePartFields.disableSize = false;
    $scope.disablePartFields.disableShape = true;
    $scope.disablePartFields.disableShortcut = true;

  }

  //- call when user will select material (only in case of either shortcut OR part type is selected)
  //- update dependent data on the base of selcted material data
  $scope.getSelectedMaterialData = function (materialObj, shapeData) {
    $scope.disablePartFields.disableCustomMaterial = true;
    $scope.estimatePartObj.selectedMaterial = materialObj;
    if ($scope.isAllselected() || angular.isDefined(shapeData)) {
      $scope.getPartFinalCalculation();
    }

  }

  //- call when user will select custom material
  //- update dependent data on the base of selcted custom material data
  $scope.getSelectedCustomMaterialData = function (materialObj) {
    //- disable fields part preset shortcut and part type
    $scope.disablePartFields.disableAllMaterial = true;
    $scope.estimatePartObj.selectedCustomMaterial = materialObj;
    $scope.getPartFinalCalculation();
  }

  //- call when user will select shape after selecting custom materialfalse
  $scope.getSelectedShapeData = function (shapeObj) {
    //- disable fields part preset shortcut, part type and custom material if custom material is not selected
    //- update shape related data
    //$scope.disablePartFields.disablePartType = true;
    $scope.disablePartFields.disableAllMaterial = false;
    $scope.disablePartFields.disableCustomMaterial = false;
    $scope.disablePartFields.showAll = false;

    $scope.estimatePartObj.length = shapeObj.length; //- length
    $scope.estimatePartObj.formFactor = shapeObj.formFactor; //- formFactor
    $scope.estimatePartObj.sizeFactor = shapeObj.sizeFactor; //- sizeFactor
    $scope.estimatePartObj.thickness = shapeObj.thickness; //- thickness
    $scope.estimatePartObj.wastage = shapeObj.wastage; //- wastage

    createOrEditEstimateService.getAllMaterials(function (data) {
      $scope.estimatePartObj.allMaterial = data;
    });
    $scope.estimatePartObj.variables = shapeObj.variable;
    if (angular.isDefined(shapeObj.shape)) {
      $scope.estimatePartObj.shapeIcon = shapeObj.shape.icon;
      $scope.estimatePartObj.shapeImage = shapeObj.shape.image;
    }
    $scope.getPartFinalCalculation();
  }
  //- call when user will select size (only in case when user selected part type)
  //- update dependent data on the base of selected size data
  $scope.getSelectedSizeData = function (partTypeObj) {
    //- get shortcut corresponding to the selected partType & size
    //- get all material data to select 
    //- get shape data from selected partType & size 
    //- update variable [] --> put variables of shape into an variable[] of estimatePartObj.variables

    $scope.estimatePartObj.formFactor = partTypeObj.formFactor; //- formFactor
    $scope.estimatePartObj.length = partTypeObj.length; //- length
    $scope.estimatePartObj.sizeFactor = partTypeObj.sizeFactor; //- sizeFactor
    $scope.estimatePartObj.thickness = partTypeObj.thickness; //- thickness
    $scope.estimatePartObj.wastage = partTypeObj.wastage; //- wastage

    $scope.estimatePartObj.selectedShortcut = partTypeObj; /////-
    $scope.estimatePartObj.selectedShape = partTypeObj.shape;

    //- update shape related data
    $scope.estimatePartObj.variables = partTypeObj.variable; /////-
    $scope.estimatePartObj.keyValueCalculations.perimeter = partTypeObj.shape.partFormulae.perimeter; /////-
    $scope.estimatePartObj.keyValueCalculations.sma = partTypeObj.shape.partFormulae.sma; /////-
    $scope.estimatePartObj.keyValueCalculations.sa = partTypeObj.shape.partFormulae.sa; /////-
    $scope.estimatePartObj.keyValueCalculations.weight = partTypeObj.shape.partFormulae.weight; /////-
    $scope.updatePartCalculation();
  }

  $scope.updatePartCalculation = function () {

    //- get shape formulae
    //- get updated variables 
    //- calculate keyValueCalculations & finalCalculation 
    //- update estimate object --> variable array
    if (angular.isDefined($scope.estimatePartObj.selectedShortcut.shape)) {
      var partFormulae = $scope.estimatePartObj.selectedShortcut.shape.partFormulae;
    } else {
      var partFormulae = $scope.estimatePartObj.selectedShape.partFormulae;
    }

    _.map($scope.estimatePartObj.variables, function (n) {
      varName = n.varName;
      varValue = parseInt(n.varValue);

      tempVar = varName;
      window[tempVar] = varValue;
    });

    if (angular.isDefined($scope.estimatePartObj.selectedShortcut.length) && $scope.estimatePartObj.selectedShortcut.length != null) {
      var l = $scope.estimatePartObj.selectedShortcut.length;
    }
    if (angular.isDefined($scope.estimatePartObj.selectedShortcut.thickness) && $scope.estimatePartObj.selectedShortcut.thickness != null) {
      var t = $scope.estimatePartObj.selectedShortcut.thickness;
    }
    if (angular.isDefined($scope.estimatePartObj.selectedShortcut.sizeFactor) && $scope.estimatePartObj.selectedShortcut.sizeFactor != null) {
      var sf = $scope.estimatePartObj.selectedShortcut.sizeFactor;
    }
    if (angular.isDefined($scope.estimatePartObj.selectedShortcut.formFactor) && $scope.estimatePartObj.selectedShortcut.formFactor != null) {
      var ff = $scope.estimatePartObj.selectedShortcut.formFactor;
    }
    if (angular.isDefined($scope.estimatePartObj.selectedShortcut.wastage) && $scope.estimatePartObj.selectedShortcut.wastage != null) {
      var wtg = $scope.estimatePartObj.selectedShortcut.wastage;
    }


    $scope.estimatePartObj.keyValueCalculations.perimeter = eval(partFormulae.perimeter);
    $scope.estimatePartObj.keyValueCalculations.sheetMetalArea = eval(partFormulae.sheetMetalArea);
    $scope.estimatePartObj.keyValueCalculations.surfaceArea = eval(partFormulae.surfaceArea);
    $scope.estimatePartObj.keyValueCalculations.weight = eval(partFormulae.weight);
    $scope.getPartFinalCalculation();
  }

  $scope.getPartFinalCalculation = function () {
    //- get all updated variable data & calculate all keyValueCalculations i.e. perimeter, sheetMetalArea, surfaceArea, weight
    //- also calculate all finalCalculation i.e. materialPrice, itemUnitPrice, totalCostForQuantity
    if (angular.isDefined($scope.estimatePartObj.selectedCustomMaterial.totalCostRsPerKg)) {
      //-if custoMaterial is selected
      $scope.estimatePartObj.finalCalculation.materialPrice = $scope.estimatePartObj.selectedCustomMaterial.totalCostRsPerKg;
      $scope.estimatePartObj.finalCalculation.itemUnitPrice = $scope.estimatePartObj.keyValueCalculations.weight * $scope.estimatePartObj.selectedCustomMaterial.totalCostRsPerKg;
    } else {
      $scope.estimatePartObj.finalCalculation.materialPrice = $scope.estimatePartObj.selectedMaterial.typicalRatePerKg;
      $scope.estimatePartObj.finalCalculation.itemUnitPrice = $scope.estimatePartObj.keyValueCalculations.weight * $scope.estimatePartObj.selectedMaterial.typicalRatePerKg;
    }
    $scope.estimatePartObj.finalCalculation.totalCostForQuantity = $scope.estimatePartObj.quantity * $scope.estimatePartObj.finalCalculation.itemUnitPrice;
  }

  $scope.isAllselected = function () {
    if ($scope.estimatePartObj.selectedShortcut != {} && $scope.estimatePartObj.selectedShortcut != undefined) {
      if ($scope.estimatePartObj.selectedPartType != {} && $scope.estimatePartObj.selectedPartType != undefined) {
        if ($scope.estimatePartObj.selectedMaterial != {} && $scope.estimatePartObj.selectedMaterial != undefined) {
          if ($scope.estimatePartObj.selectedSize != {} && $scope.estimatePartObj.selectedSize != undefined) {
            return true;
          }
        }
      }
    }

  }

  //- to update part calculation detail into an corresponding part 
  $scope.updatePartDetail = function (partObject) {
    createOrEditEstimateService.updatePartDetail($scope.showEditBtn, partObject, function (data) {
      $scope.estimteData = data;
      toastr.success('Part Details Added Successfully...');
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
  $scope.$watch('estimatePartObj', function (newValue, oldValue) {
    if (oldValue != undefined) {
      if (newValue != oldValue) {
        $scope.changesCounter += 1;
      }
    }
  }, true);
  //- to update all calculations at processing, addons & extras 
  // $scope.$watch('estimatePartObj.keyValueCalculations', function (newValue, oldValue) {
  //   
  //   if (oldValue != undefined) {
  //     if (newValue != oldValue) {
  //       createOrEditEstimateService.updateAllCalculations(newValue, function(data) {

  //       });
  //     }
  //   }
  // }, true);
  //- to ask user to save changes before redirecting
  $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    if (fromState.name == 'app.createEstimate' && $scope.changesCounter > '0') {
      var answer = window.confirm('Please Save Your Changes !!!');
      if (answer) {
        event.preventDefault();
      }
    }
  });
  //- to ask user to save changes before refreshing the page
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
      toastr.success('Estimate data updated successfully');
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
      toastr.success('SubAssembly deleted successfully');
      $scope.getEstimateView('assembly');
      createOrEditEstimateService.totalCostCalculations(function (data) {});
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
      toastr.success('SubAssemblies deleted successfully');
    });
  }
  //- import subAssembly modal
  $scope.importSubAssemblyModal = function () {
    $scope.versionData = null;
    $scope.versionObj = null;
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
  //- to get all versions of subAssembly
  $scope.getSubAssVersions = function (subAssObj) {
    $scope.versionData = subAssObj.versionDetail;
  }
  //- to import subAssembly
  $scope.importSubAssembly = function (subAssId) {
    createOrEditEstimateService.getImportSubAssemblyData(subAssId, function () {
      $scope.getCurretEstimateObj();
      toastr.success('SubAssembly imported successfully');
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
        $scope.addPart($scope.formData, $scope.subAssId);
      } else {
        $scope.formData = data.partObj;
        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/createOrEditPartName.html',
          scope: $scope,
          size: 'md',
        });
      }
    });
  }
  //- to add part data
  $scope.addPart = function (partData, subAssId) {
    createOrEditEstimateService.createPart(partData, subAssId, function () {
      $scope.getCurretEstimateObj();
      toastr.success('Part added successfully');
      $scope.cancelModal();
    });
  }
  //- to edit part data 
  $scope.editPart = function () {
    $scope.getCurretEstimateObj();
    toastr.success('Part updated successfully');
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
      createOrEditEstimateService.totalCostCalculations(function (data) {});
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
    $scope.versionData = null;
    $scope.versionObj = null;
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
  //- to get all versions of selected part
  $scope.getPartVersions = function (partObj) {
    $scope.versionData = partObj.versionDetail;
  }
  //- to import part
  $scope.importPart = function (subAssId, partId) {
    createOrEditEstimateService.getImportPartData(subAssId, partId, function () {
      $scope.getCurretEstimateObj();
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      toastr.success('Part imported successfully');
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
        createOrEditEstimateService.totalCostCalculations(function (data) {});
        toastr.success('Part added successfully');
      });
    } else {
      toastr.warning('Please Enter Valid SubAssembly Number');
    }
  }
  //- to import current part to  different subAssembly 
  $scope.importPartToDifferentSubAssemblyModal = function (subAssNumber, part) {
    $scope.partData = part;
    createOrEditEstimateService.getAllSubAssNumbers(function (data) {
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
      toastr.success('Addon added successfully');
      $scope.cancelModal();
    });
  }
  //- to edit Addon at assembly or subssembly or at partLevel
  $scope.editAddon = function () {
    $scope.getCurretEstimateObj();
    toastr.success('Addon updated successfully');
    $scope.cancelModal();
  }
  //- delete addon
  $scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function () {
      toastr.success('Addon deleted successfully');
      $scope.getEstimateView('addons', level, subAssemblyId, partId);
      createOrEditEstimateService.totalCostCalculations(function (data) {});
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
      toastr.success('Addons deleted successfully');
    });
  }
  //- to get all versions of selected addon
  $scope.getAddonVersions = function (addonObj) {
    $scope.versionData = addonObj.versionDetail;
  }
  //- Import Addon
  $scope.importAddon = function (addonId, level, subAssemblyId, partId) {
    createOrEditEstimateService.getImportAddonData(addonId, level, subAssemblyId, partId, function () {
      $scope.getCurretEstimateObj();
      toastr.success('Addon imported successfully');
      $scope.cancelModal();
    });
  }

  //- ..................................Custom Material Module start.......................... -//

  //- modal to add or edit custom material
  $scope.addOrEditCustomMaterialModal = function (operation, customMaterial) {
    createOrEditEstimateService.getCustomMaterialModalData(operation, customMaterial, function (data) {

      $scope.formData = data.custMaterialObj;
      $scope.customMaterialDataObj = {
        allBaseMetals: data.allBaseMetals,
        allAlloys: data.allAlloys,
        allDifficultyFactors: data.allDifficultyFactors,
      };
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
    createOrEditEstimateService.createCustomMaterial(customMaterialdata, function () {
      $scope.getAllMaterialData();
      toastr.success("Custom Material Added/Updated Successfully");
      $scope.cancelModal();
    });
  }
  //- to get cost of base metal
  //- costOfDepRsPerKg is typicalRatePerKg of selected material
  //- if free issue is ticked then take 20% of costOfDepRsPerKg
  //- formula for costOfDepRsPerSm is  density * costOfDepRsPerKg * thickness
  $scope.getCostOfBaseMetal = function (formData, freeIssue) {
    if (freeIssue) {
      formData.basePlate.costOfDepRsPerKg = formData.basePlate.baseMetal.typicalRatePerKg * 0.2;
    } else {
      formData.basePlate.costOfDepRsPerKg = formData.basePlate.baseMetal.typicalRatePerKg;
    }
    formData.basePlate.costOfDepRsPerSm = formData.basePlate.baseMetal.density * formData.basePlate.costOfDepRsPerKg * formData.basePlate.thickness;
    $scope.calAvgCost(formData);
  }
  //- to get cost of base metal
  //- costOfDepRsPerKg is typicalRatePerKg of selected material
  //- if free issue is ticked then take 20% of costOfDepRsPerKg
  //- formula for costOfDepRsPerSm is  density * costOfDepRsPerKg * thickness
  $scope.getCostOfAlloy = function (formData, alloyObj) {
    alloyObj.costOfDepRsPerKg = alloyObj.alloy.typicalRatePerKg;
    alloyObj.costOfDepRsPerSm = alloyObj.alloy.density * alloyObj.alloy.typicalRatePerKg * alloyObj.thickness;
    $scope.calAvgCost(formData);
  }
  //- to get average cost of hardFacing alloys
  //- to get totalCostRsPerKg and totalCostRsPerSm
  //- formula for agvRsPerKg is sum(allHardFacingAlloys(thickness * density)) / sum(allHardFacingAlloys(thickness))
  //- formula for costOfDepRsPerSm is sum(allHardFacingAlloys(costOfDepRsPerSm))
  //- formula for totalCostRsPerKg is sum(allMaerials(thickness * density)) / sum(allMaerials(thickness)) * mulFact
  //- formula for totalCostRsPerSm is sum(allMaerials(costOfDepRsPerSm)) * mulFact
  $scope.calAvgCost = function (customMaterial) {
    var temp1 = temp2 = 0;
    customMaterial.hardFacingAlloys.agvRsPerSm = customMaterial.hardFacingAlloys.agvRsPerKg = 0;
    angular.forEach(customMaterial.hardFacingAlloys,  function (record) {
      customMaterial.hardFacingAlloys.agvRsPerSm += record.costOfDepRsPerSm;
      temp1 += parseFloat(record.thickness) * record.alloy.density;
      temp2 += parseFloat(record.thickness);
    });
    customMaterial.hardFacingAlloys.agvRsPerKg = temp1 / temp2;
    temp1 = 0;
    angular.forEach(customMaterial.hardFacingAlloys,  function (record) {
      temp1 += parseFloat(record.thickness) * record.alloy.typicalRatePerKg;
    });
    temp1 += parseFloat(customMaterial.basePlate.thickness) * customMaterial.basePlate.costOfDepRsPerKg;
    temp2 += parseFloat(customMaterial.basePlate.thickness);
    var mulfact = 1;

    angular.forEach(customMaterial.difficultyFactor,  function (record) {
      mulfact *= parseFloat(record.mulfact);
    });
    customMaterial.totalCostRsPerKg = (temp1 / temp2) * mulfact;
    customMaterial.totalCostRsPerSm = (customMaterial.hardFacingAlloys.agvRsPerSm + customMaterial.basePlate.costOfDepRsPerSm) * mulfact;
  }
  //-to add a hard facing alloy
  $scope.addNewLayer = function (hardFacingAlloys) {
    var temp = _.last(hardFacingAlloys);
    if (temp.thickness != "" && angular.isDefined(temp.alloy._id)) {
      var tempArray = {
        thickness: "",
        alloy: {},
        costOfDepRsPerKg: "",
        costOfDepRsPerSm: ""
      };
      hardFacingAlloys.push(_.cloneDeep(tempArray));
    }
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
  $scope.deleteCustomMaterial = function (customMaterialId) {
    createOrEditEstimateService.deleteCustomMaterial(customMaterialId, function (data) {
      toastr.success("Custom Material Deleted Successfully");
      $scope.getAllMaterialData();
      $scope.cancelModal();
    });
  }
  //- ..................................Custom Material Module end.......................... -//



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
    $scope.versionData = null;
    $scope.versionObj = null;
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
      //- get linkedKeyValuesAtPartCalculation objet from service
      if (level == 'part') {
        $scope.partProcessingObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtPartCalculation;
      } else if (level == 'subAssembly') {
        $scope.partProcessingObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtSubAssemblyCalculation;
      } else if (level == 'assembly') {
        $scope.partProcessingObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtAssemblyCalculation;
      }
      //- to restrict user
      var tempObj = $scope.partProcessingObj.linkedKeyValuesCalculation;
      if ((isNaN(parseFloat(tempObj.perimeter))) && (isNaN(parseFloat(tempObj.sheetMetalArea))) && (isNaN(parseFloat(tempObj.surfaceArea))) && (isNaN(parseFloat(tempObj.weight)))) {
        toastr.warning('You cannot able to access it now');
      } else {
        if (operation == 'save') {
          //- get required data to add processing
          $scope.partProcessingObj.processingTypeData = data.processingTypeData;
          $scope.showSaveBtn = true;
          $scope.showEditBtn = false;
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
          //$scope.partProcessingObj.currentPartObj = data.currentPartObj;
          $scope.partProcessingObj.processingNumber = data.processingNumber;

          $scope.showSaveBtn = false;
          $scope.showEditBtn = true;
        }

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/createOrEditProcessing.html',
          scope: $scope,
          size: 'md',
        });
      }
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

    debugger;
    //- is there anything else  user will put in mul5fact while adding processing type
    if ($scope.partProcessingObj.selectedProcessingType.rate.mulFact == 't') {
      //- get thickness of corresponding level   
      //- i.e.  part level, subAssembly level or assemby level 
      var t = $scope.estimatePartObj.selectedShortcut.thickness;
    } else {
      $scope.partProcessingObj.rate.actualRate = parseFloat($scope.partProcessingObj.selectedProcessingType.rate.mulFact) * parseFloat($scope.partProcessingObj.selectedProcessingItem.rate);
    }

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
        toastr.success('Processing added successfully');
        $scope.cancelModal();
      });
    } else if (operation == 'update') {
      createOrEditEstimateService.updateProcessing(processing, level, subAssemblyId, partId, function () {
        $scope.getEstimateView('processing', level, subAssemblyId, partId);
        toastr.success('Processing updated successfully');
        $scope.cancelModal();
      });
    }
    createOrEditEstimateService.totalCostCalculations(function (data) {});

  }
  //- to edit processing at assembly or subssembly or at partLevel
  $scope.editProcessing = function () {
    $scope.getCurretEstimateObj();
    createOrEditEstimateService.totalCostCalculations(function (data) {});
    toastr.success('Processing updated successfully');
    $scope.cancelModal();
  }
  //- to delete processing
  $scope.deleteProcessing = function (processingId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteProcessing(processingId, level, subAssemblyId, partId, function (data) {
      toastr.success('Processing deleted successfully');
      $scope.getEstimateView('processing', level, subAssemblyId, partId);
      createOrEditEstimateService.totalCostCalculations(function (data) {});
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
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      toastr.success('Processing deleted successfully');
    });
  }
  //- to get all versions of selected processing
  $scope.getProcessingVersions = function (processingObj) {
    $scope.versionData = processingObj.versionDetail;
  }
  //- import processing
  $scope.importProcessing = function (processingId, level, subAssemblyId, partId) {
    createOrEditEstimateService.getImportProcessingData(processingId, level, subAssemblyId, partId, function () {
      $scope.getCurretEstimateObj();
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      toastr.success('Processing imported successfully');
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

  // **********Extra add modal*************************

  $scope.getExtraObj = function () {
    $scope.extraObj = {
      allExtraItem: [],
      selectedExtraItem: {},
      quantity: 1,
      remark: "",
      totalCost: "",
      rate: "",
      uom: ""
    };
  }

  $scope.getExtraObj();

  $scope.addOrEditExtraModal = function (operation, level, subAssemblyId, partId, extraId) {
    $scope.getExtraObj();
    $scope.level = level;
    $scope.subAssemblyId = subAssemblyId;
    $scope.partId = partId;

    createOrEditEstimateService.getExtraModalData(operation, level, subAssemblyId, partId, extraId, function (data) {
      if (operation == 'save') {
        //- get required data to add processing
        $scope.extraObj.allExtraItem = data.allExtraItem;
        $scope.showSaveBtn = true;
        $scope.showEditBtn = false;
      } else if ('update') {
        $scope.extraObj.allExtraItem = data.allExtraItem;
        $scope.extraObj.selectedExtraItem = data.selecetdExtraItem;
        $scope.extraObj.extraNumber = data.extraNumber;
        $scope.extraObj.totalCost = data.totalCost;
        $scope.extraObj.remark = data.remark;
        $scope.extraObj.quantity = data.quantity;
        $scope.extraObj.rate = data.rate;
        $scope.extraObj.uom = data.uom;
        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;
      }

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/estimate/estimateModal/createOrEditExtra.html',
        scope: $scope,
        size: 'md'
      });
    });
  }

  $scope.getSelectedExtraItem = function (extraObjData) {
    //- calculate rate

    $scope.extraObj.selectedExtraItem = extraObjData;
    $scope.extraObj.totalCost = parseFloat(extraObjData.rate.name) * 1;
    $scope.extraObj.uom = extraObjData.rate.uom.uomName;
  }

  $scope.changeQuantity = function (q) {
    $scope.extraObj.totalCost = parseFloat($scope.extraObj.selectedExtraItem.rate.name) * q;
  }

  //- to add Extra at assembly or subssembly or at partLevel
  $scope.addExtra = function (extraData, level, subAssemblyId, partId) {

    var extra = {
      extraItem: extraData.selectedExtraItem,
      extraNumber: extraData.extraNumber,
      totalCost: extraData.totalCost,
      remark: extraData.remark,
      quantity: extraData.quantity,
      rate: extraData.selectedExtraItem.rate.name,
      uom: extraData.uom
    }
    createOrEditEstimateService.addExtra(extra, level, subAssemblyId, partId, function () {
      $scope.getEstimateView('extras', level, subAssemblyId, partId);
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      toastr.success('Extra added successfully');
      $scope.cancelModal();
    });
  }
  //- to edit Extra at assembly or subssembly or at partLevel
  $scope.updateExtra = function (extraObj, level, subAssemblyId, partId, extraId) {
    createOrEditEstimateService.updateExtra(extraObj, level, subAssemblyId, partId, extraId, function (data) {
      $scope.getCurretEstimateObj();
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      toastr.success('Extra updated successfully');
      $scope.cancelModal();
    });
  }

  //- to delete Extra
  $scope.deleteExtra = function (extraId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteExtra(extraId, level, subAssemblyId, partId, function () {
      toastr.success('Extra deleted successfully');
      $scope.getEstimateView('extras', level, subAssemblyId, partId);
      createOrEditEstimateService.totalCostCalculations(function (data) {});
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
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      $scope.cancelModal();
      toastr.success('Extras deleted successfully');
    });
  }
  //- to get all versions of selected extra
  $scope.getExtraVersions = function (extraObj) {
    $scope.versionData = extraObj.versionDetail;
  }
  //- Import Extra
  $scope.importExtra = function (extraId, level, subAssemblyId, partId) {
    createOrEditEstimateService.getImportExtraData(extraId, level, subAssemblyId, partId, function () {
      $scope.getCurretEstimateObj();
      createOrEditEstimateService.totalCostCalculations(function (data) {});
      toastr.success('Extra imported successfully');
      $scope.cancelModal();
    });
  }

  // **********************************end extra*********************************************

  // **************************************** init all default functions begin here **************************************** //
  //- to initilize the default function 
  $scope.init = function () {
    // to get default view
    $scope.getEstimateData();
    $scope.getEstimateView('assembly');
    //to get estimate tree structure data 
    $scope.getAllMaterialData();
  }
  $scope.init();




  //- ==================================== addon functionality/calculation start ==================================== //

  $scope.getAddonObject = function () {
    $scope.addonObj = {
      addonNumber: "",
      allAddonTypes: [],
      allMaterials: [],
      selectedAddonType: {},
      selectedMaterial: {},
      rate: {
        value: "", //- selectedAddonType-->rate-->mulFact *  selectedMaterial-->typicaRatePerKg
        uom: "" //- selectedAddonType-->rate-->uom
      },
      quantity: {
        supportingVariable: {
          supportingVariable: "", //- selectedAddonType-->quantity-->additional input field
          value: 1, //- take from user
          uom: "" //- selectedAddonType-->quantity-->additionalInputUom
        },
        keyValue: {
          keyVariable: "", //- selectedAddonType-->quantity-->linkedKey 
          keyValue: "", //- selectedAddonType-->quantity-->mulFact * (selected selectedAddonType-->quantity-->linkedKey) from part calculation
          uom: "" //- selectedAddonType-->quantity-->linkedKeyUom
        },
        utilization: 100, //- get it from user, in default it is 100
        contengncyOrWastage: 10, //- get it from user, kin default it is 10 
        total: 1 //- get it from user, in default it is 1
      },
      totalCost: "", //- rate-->value * quantity-->total
      totalWeight: "", //- quantity-->total * selectedMaterial-->typicaRatePerKg
      remarks: "", //- get it from user
      finalUom: "", //- selectedAddonType-->quantity-->finalUom 
      linkedKeyValuesCalculation: { //- get all calculation at part/subAssembly/assembly level
        perimeter: null,
        SMA: null,
        SA: null,
        Wt: null,
        Nos: null,
        Hrs: null
      }
    }
  }

  $scope.getAddonObject();

  $scope.addOrEditAddonModal = function (operation, level, subAssemblyId, partId, addonId) {
    $scope.getAddonObject();



    $scope.level = level;
    $scope.subAssemblyId = subAssemblyId;
    $scope.partId = partId;

    //- get required data to add processing
    createOrEditEstimateService.getAddonModalData(operation, level, subAssemblyId, partId, addonId, function (data) {

      //- get linkedKeyValuesAtPartCalculation objet from service
      if (level == 'part') {
        $scope.addonObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtPartCalculation;
      } else if (level == 'subAssembly') {
        $scope.addonObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtSubAssemblyCalculation;
      } else if (level == 'assembly') {
        $scope.addonObj.linkedKeyValuesCalculation = data.linkedKeyValuesAtAssemblyCalculation;
      }
      var tempObj = $scope.addonObj.linkedKeyValuesCalculation;
      if ((isNaN(parseFloat(tempObj.perimeter))) && (isNaN(parseFloat(tempObj.sheetMetalArea))) && (isNaN(parseFloat(tempObj.surfaceArea))) && (isNaN(parseFloat(tempObj.weight)))) {
        toastr.warning('You cannot able to access it now');
      } else {
        if (operation == 'save') {
          //- get required data to add addon
          $scope.addonObj.allAddonTypes = data.allAddonTypes;
        } else if (operation == 'update') {

          $scope.addonObj.allAddonTypes = data.allAddonTypes;
          $scope.addonObj.allMaterials = data.allMaterials;
          $scope.addonObj.selectedAddonType = data.selectedAddonType;
          $scope.addonObj.selectedMaterial = data.selectedMaterial;

          $scope.addonObj.rate.value = data.rate.value;
          $scope.addonObj.rate.uom = data.rate.uom;

          $scope.addonObj.quantity.supportingVariable.supportingVariable = data.quantity.supportingVariable.supportingVariable;
          $scope.addonObj.quantity.supportingVariable.value = data.quantity.supportingVariable.value;
          $scope.addonObj.quantity.supportingVariable.uom = data.quantity.supportingVariable.uom;

          $scope.addonObj.quantity.keyValue.keyVariable = data.quantity.keyValue.keyVariable;
          $scope.addonObj.quantity.keyValue.keyValue = data.quantity.keyValue.keyValue;
          $scope.addonObj.quantity.keyValue.uom = data.quantity.keyValue.uom;

          $scope.addonObj.quantity.utilization = data.quantity.utilization;
          $scope.addonObj.quantity.contengncyOrWastage = data.quantity.contengncyOrWastage;
          $scope.addonObj.quantity.total = data.quantity.total;

          $scope.addonObj.remark = data.remarks;
          // $scope.addonObj.currentPartObj = data.currentPartObj;
          $scope.addonObj.addonNumber = data.addonNumber;
          // $scope.addonObj.totalWeight = data;
          // $scope.addonObj.totalWeight = ;

          $scope.addonObj.totalCost = parseFloat(data.quantity.total) * parseFloat(data.selectedMaterial.typicalRatePerKg) * parseFloat(data.quantity.supportingVariable.value);
          $scope.addonObj.totalWeight = parseFloat(data.quantity.total) * parseFloat(data.selectedMaterial.weightPerUnit);
          $scope.addonObj.finalUom = data.selectedAddonType.quantity.finalUom.uomName;

          $scope.showSaveBtn = false;
          $scope.showEditBtn = true;
        }
        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/createOrEditAddon.html',
          scope: $scope,
          size: 'md',
        });
      }
    });
  }

  //- when user select an addonType
  $scope.getSelectedAddonType = function (selectedAddonType) {
    //- update selectedAddonType in selectedAddonType
    $scope.addonObj.selectedAddonType = selectedAddonType;

    //- get all material of corresponding selected addonType
    createOrEditEstimateService.getSelectedAddonType(selectedAddonType._id, function (data) {
      $scope.addonObj.allMaterials = data;
    });

    //- bind all data which is dependent on addonType
    $scope.addonObj.rate.uom = selectedAddonType.rate.uom.uomName;


    //- get it from selecetdAddonType
    $scope.addonObj.quantity.supportingVariable.supportingVariable = selectedAddonType.quantity.additionalInput;
    $scope.addonObj.quantity.supportingVariable.uom = selectedAddonType.quantity.additionalInputUom.uomName; //- get it from selecetdAddonType

    var tempLinkedKeyValue = $scope.addonObj.selectedAddonType.quantity.linkedKey;
    $scope.addonObj.quantity.keyValue.keyVariable = tempLinkedKeyValue;
    $scope.addonObj.quantity.keyValue.uom = selectedAddonType.quantity.linkedKeyUom.uomName; //


    if (tempLinkedKeyValue == "Perimeter") {
      $scope.addonObj.quantity.keyValue.keyValue = parseFloat($scope.addonObj.linkedKeyValuesCalculation.perimeter) * parseFloat(selectedAddonType.quantity.mulFact);
    } else if (tempLinkedKeyValue == "SMA") {
      $scope.addonObj.quantity.keyValue.keyValue = parseFloat($scope.addonObj.linkedKeyValuesCalculation.SMA) * parseFloat(selectedAddonType.quantity.mulFact);
    } else if (tempLinkedKeyValue == "SA") {
      $scope.addonObj.quantity.keyValue.keyValue = parseFloat($scope.addonObj.linkedKeyValuesCalculation.SA) * parseFloat(selectedAddonType.quantity.mulFact);
    } else if (tempLinkedKeyValue == "Wt") {
      $scope.addonObj.quantity.keyValue.keyValue = parseFloat($scope.addonObj.linkedKeyValuesCalculation.Wt) * parseFloat(selectedAddonType.quantity.mulFact);
    } else if (tempLinkedKeyValue == "Nos") {
      $scope.addonObj.quantity.keyValue.keyValue = parseFloat($scope.addonObj.linkedKeyValuesCalculation.Nos) * parseFloat(selectedAddonType.quantity.mulFact);
    } else if (tempLinkedKeyValue == "Hrs") {
      $scope.addonObj.quantity.keyValue.keyValue = parseFloat($scope.addonObj.linkedKeyValuesCalculation.Hrs) * parseFloat(selectedAddonType.quantity.mulFact);
    }


    $scope.addonObj.finalUom = selectedAddonType.quantity.finalUom.uomName; //- selected selectedAddonType-->quantity-->finalUom 



  }

  //- when user select an material
  $scope.getSelectedMaterial = function (selectedMaterial) {
    //- get rate selectedAddonType-->rate * selectedMaterial --> typicalRatepeKg
    //- 

    $scope.addonObj.rate.value = $scope.addonObj.selectedAddonType.rate.mulFact * selectedMaterial.typicalRatePerKg;

    //- update following after change quantity again
    $scope.addonObj.totalCost = parseFloat($scope.addonObj.quantity.total) * parseFloat(selectedMaterial.typicalRatePerKg);
    $scope.addonObj.totalWeight = parseFloat($scope.addonObj.quantity.total) * parseFloat(selectedMaterial.weightPerUnit);

  }

  $scope.changeAddonQuantity = function (quantity) {
    $scope.addonObj.totalCost = parseFloat(quantity) * parseFloat($scope.addonObj.selectedMaterial.typicalRatePerKg) * $scope.addonObj.quantity.supportingVariable.value;
    $scope.addonObj.totalWeight = parseFloat(quantity) * parseFloat($scope.addonObj.selectedMaterial.weightPerUnit);
  }

  $scope.changeSVValue = function () {
    // $scope.addonObj.quantity.supportingVariable.value = svValue;
    $scope.addonObj.totalCost = parseFloat($scope.addonObj.quantity.total) * parseFloat($scope.addonObj.selectedMaterial.typicalRatePerKg) * $scope.addonObj.quantity.supportingVariable.value;
  }

  //- to add Addon at assembly or subssembly or at partLevel
  $scope.addAddon = function (operation, addonData, level, subAssemblyId, partId) {

    var addon = {
      addonNumber: addonData.addonNumber,
      addonType: addonData.selectedAddonType,
      addonItem: addonData.selectedMaterial,
      rate: addonData.rate.value,
      quantity: {
        supportingVariable: {
          supportingVariable: addonData.quantity.supportingVariable.supportingVariable,
          value: addonData.quantity.supportingVariable.value
        },
        keyValue: {
          keyVariable: addonData.quantity.keyValue.keyVariable,
          keyValue: addonData.quantity.keyValue.keyValue,
        },
        utilization: addonData.quantity.utilization,
        contengncyOrWastage: addonData.quantity.contengncyOrWastage,
        total: addonData.quantity.total
      },
      totalCost: addonData.totalCost,
      remarks: addonData.remarks
    };

    if (operation == 'save') {
      createOrEditEstimateService.createAddon(addon, level, subAssemblyId, partId, function () {
        $scope.getEstimateView('addons', level, subAssemblyId, partId);
        toastr.success('Addon added successfully');
        $scope.cancelModal();
      });
    } else if (operation == 'update') {
      createOrEditEstimateService.updateAddon(addon, level, subAssemblyId, partId, function () {
        $scope.getEstimateView('addons', level, subAssemblyId, partId);
        toastr.success('Addon updated successfully');
        $scope.cancelModal();
      });
    }
  }
  //- to edit Addon at assembly or subssembly or at partLevel
  $scope.editAddon = function () {
    $scope.getCurretEstimateObj();
    toastr.success('Addon updated successfully');
    createOrEditEstimateService.totalCostCalculations(function (data) {});
    $scope.cancelModal();
  }
  //- delete addon
  $scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {
    createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function () {
      toastr.success('Addon deleted successfully');
      $scope.getEstimateView('addons', level, subAssemblyId, partId);
      createOrEditEstimateService.totalCostCalculations(function (data) {});
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
      toastr.success('Addons deleted successfully');
    });
  }
  //- Import Addon
  $scope.importAddon = function (addonId, level, subAssemblyId, partId) {
    createOrEditEstimateService.getImportAddonData(addonId, level, subAssemblyId, partId, function () {
      $scope.getCurretEstimateObj();
      toastr.success('Addon imported successfully');
      $scope.cancelModal();
    });
  }

  //- ==================================== addon functionality/calculation end   ==================================== //





});