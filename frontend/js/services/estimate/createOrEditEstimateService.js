myApp.service('createOrEditEstimateService', function (NavigationService) {

	var bulkArray = [];

	var processing = {
		processingNumber: "",
		processType: {},
		processItem: {},
		rate: null,
		quantity: {
			linkedKeyValue: {
				keyVariable: null,
				keyValue: null
			},
			totalQuantity: null,
			utilization: null,
			contengncyOrWastage: null
		},
		remark: "",
		totalCost: null
	};

	var addon = {
		addonType: "",
		addonItem: "",
		rate: "",
		quantity: {
			supportingVariable: {
				supportingVariable: "",
				value: ""
			},
			keyValue: {
				keyVariable: "",
				keyValue: ""
			},
			utilization: "",
			contengncyOrWastage: "",
			total: ""
		},
		totalCost: "",
		remarks: ""
	};

	var extra = {
		extraItem: "",
		extraNumber: "",
		quantity: "",
		totalCost: "",
		remarks: ""
	};

	var part = {
		partName: "",
		partNumber: "",
		partIcon: "",

		shortcut: "", //- selecetd shortCut
		partType: "", //- selected partType
		material: "", //- selected material
		size: "", //- size

		customMaterial: "", //- selectedCustomeMaterial
		quantity: "", //- quantity
		variable: [{}], //- variables 
		scaleFactor: "", //- sacaleFactor

		finalCalculation: { //- finalCalculation
			materialPrice: "",
			itemUnitPrice: "",
			totalCostForQuantity: ""
		},
		keyValueCalculations: { //- keyValueCalculation
			perimeter: "",
			sheetMetalArea: "",
			surfaceArea: "",
			weight: ""
		},
		processingCost: "",
		addonCost: "",
		extrasCost: "",
		totalCost: "",

		processing: [],
		addons: [],
		extras: [],

		partUpdateStatus: false
	};

	var subAssembly = {
		subAssemblyName: "",
		subAssemblyNumber: "",
		quantity: "",
		totalValue: "",
		keyValueCalculations: {
			perimeter: "",
			sheetMetalArea: "",
			surfaceArea: "",
			weight: "",
			numbers: "",
			hours: ""
		},
		totalWeight: "",
		materialCost: "",
		processingCost: "",
		addonCost: "",
		extrasCost: "",
		totalCost: "",
		subAssemblyParts: [],
		processing: [],
		addons: [],
		extras: []
	};

	var assembly = {
		enquiryId: "",
		assemblyName: "",
		assemblyNumber: "",
		keyValueCalculations: {
			perimeter: "",
			sheetMetalArea: "",
			surfaceArea: "",
			weight: "",
			numbers: "",
			hours: ""
		},
		totalWeight: "",
		materialCost: "",
		processingCost: "",
		addonCost: "",
		extrasCost: "",
		totalCost: "",
		estimateId: "",
		estimateCreatedUser: "",
		estimateUpdatedUser: "",
		estimateDetails: {},
		estimateBoq: {},
		estimateAttachment: [{
			file: ""
		}],
		subAssemblies: [],
		processing: [],
		addons: [],
		extras: []
	};

	var formData = {
		assembly: {},
		customMaterial: [],
	};

	var customMaterial = {
		basePlate: {
			thickness: "",
			freeIssue: "",
			baseMetal: ""
		},
		hardFacingAlloys: [_.cloneDeep(hardFacingAlloy)],
		mulFact: "",
		codPerKg: "",
		codPerMeterSquare: ""
	};

	var hardFacingAlloy = {
		thickness: "",
		alloy: "",
		codPerKg: "",
		codPerMeterSquare: ""
	}

	//- to get customer material data
	this.getCustomMaterialData = function (callback) {
		callback(formData.customMaterial);
	}
	//-to get current estimate object
	this.getCurretEstimateObj = function (callback) {
		callback(formData.assembly);
	}
	//- to get esttimate data from api
	this.getEstimateData = function (draftEstimateId, callback) {
		// if ($.jStorage.get('estimateObject') != null) {
		// 	formData.assembly = $.jStorage.get('estimateObject');
		// 	callback(formData.assembly);
		// } else {
		var temp = this;
		NavigationService.apiCall('DraftEstimate/getOne', {
			_id: draftEstimateId
		}, function (data) {
			if (data.data == "ObjectId Invalid") {
				callback(data.data);
			} else {
				formData.assembly = data.data;
				temp.totalCostCalculations(function (data) {});
				callback(data.data);
			}
		});
		// }
	}
	//- to set a view of the page
	this.estimateView = function (estimateView, getLevelName, subAssemblyId, partId, callback) {
		var checkAccess = 0;
		if (estimateView == 'processing' || estimateView == 'addons' || estimateView == 'extras') {
			if (getLevelName == "assembly") {
				var tempObj = formData.assembly.keyValueCalculations;
			} else if (getLevelName == "subAssembly") {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var tempObj = formData.assembly.subAssemblies[subAssIndex].keyValueCalculations;
			} else if (getLevelName == "part") {

				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				var tempObj = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].keyValueCalculations;
			}
			if ((isNaN(parseFloat(tempObj.perimeter))) && (isNaN(parseFloat(tempObj.sheetMetalArea))) && (isNaN(parseFloat(tempObj.surfaceArea))) && (isNaN(parseFloat(tempObj.weight)))) {
				checkAccess += 1;
			}
		}
		if (checkAccess == 0) {
			getEstimateView = "views/content/estimate/estimateViews/" + estimateView + ".html";
			callback(getEstimateView);
		} else {
			callback('restrictUser');
		}
	}
	//- to calculate total cost of addon/processing/extras
	this.totalCostCalculations = function (callback) {
		var costCalculations = {
			pCost: 0,
			pCost: 0,
			aCost: 0,
			eCost: 0,
			pCostAtPart: 0,
			pCostAtSubAssembly: 0,
			pCostAtAssemby: 0,
			aCostAtPart: 0,
			aCostAtSubAssembly: 0,
			aCostAtAssemby: 0,
			eCostAtPart: 0,
			eCostAtSubAssembly: 0,
			eCostAtAssemby: 0,
			wtAtPart: 0,
			wtAtSubAssembly: 0,
			mtAtSubAssembly: 0,
			mtAtAssembly: 0
		}
		angular.forEach(formData.assembly.subAssemblies, function (subAssembly) {
			angular.forEach(subAssembly.subAssemblyParts, function (part) {
				costCalculations.wtAtPart += parseFloat(part.keyValueCalculations.weight);
				costCalculations.mtAtSubAssembly += parseFloat(part.finalCalculation.materialPrice);
				angular.forEach(part.processing, function (processing) {
					costCalculations.pCostAtPart += processing.rate * processing.quantity.totalQuantity
				});
				angular.forEach(part.addons, function (addon) {
					costCalculations.aCostAtPart += addon.totalCost;
				});
				angular.forEach(part.extras,  function (extra) {
					costCalculations.eCostAtPart += extra.totalCost;
				});
				part.processingCost = costCalculations.pCostAtPart;
				part.addonCost = costCalculations.aCostAtPart;
				part.extrasCost = costCalculations.eCostAtPart;
				if (part.processing.length != 0) {
					costCalculations.pCost += costCalculations.pCostAtPart;
					costCalculations.pCostAtPart = 0;
				}
				if (part.addons.length != 0) {
					costCalculations.aCost += costCalculations.aCostAtPart;
					costCalculations.aCostAtPart = 0;
				}
				if (part.extras.length != 0) {
					costCalculations.eCost += costCalculations.eCostAtPart;
					costCalculations.eCostAtPart = 0;
				}
				if (part.processing.length != 0 || part.addons.length != 0 || part.extras.length != 0) {
					part.totalCost = costCalculations.wtAtPart + costCalculations.mtAtSubAssembly + part.processingCost + part.addonCost + part.extrasCost;
				}
			});

			subAssembly.totalWeight = costCalculations.wtAtPart;
			costCalculations.wtAtSubAssembly += subAssembly.totalWeight;
			subAssembly.materialCost = costCalculations.mtAtSubAssembly;
			costCalculations.mtAtAssembly += subAssembly.materialCost;

			angular.forEach(subAssembly.processing, function (processing) {
				costCalculations.pCostAtSubAssembly += processing.rate * processing.quantity.totalQuantity
			});
			angular.forEach(formData.assembly.addons, function (addon) {
				costCalculations.aCostAtSubAssembly += addon.totalCost;
			});
			angular.forEach(formData.assembly.extras, function (extra) {
				costCalculations.eCostAtSubAssembly += extra.totalCost;
			});
			costCalculations.pCost += costCalculations.pCostAtSubAssembly;
			costCalculations.aCost += costCalculations.aCostAtSubAssembly;
			costCalculations.eCost += costCalculations.eCostAtSubAssembly;
			subAssembly.processingCost = costCalculations.pCost;
			subAssembly.addonCost = costCalculations.aCost;
			subAssembly.extrasCost = costCalculations.eCost;
			costCalculations.pCostAtAssemby += costCalculations.pCost;
			costCalculations.aCostAtAssemby += costCalculations.aCost;
			costCalculations.eCostAtAssemby += costCalculations.eCost;
			subAssembly.totalCost = subAssembly.totalWeight + subAssembly.materialCost + subAssembly.processingCost + subAssembly.addonCost + subAssembly.extrasCost;
			costCalculations.pCostAtSubAssembly = costCalculations.aCostAtSubAssembly = costCalculations.eCostAtSubAssembly = 0;
			costCalculations.pCost = costCalculations.aCost = costCalculations.eCost = 0;

		});
		formData.assembly.totalWeight = costCalculations.wtAtSubAssembly;
		formData.assembly.materialCost = costCalculations.mtAtAssembly;
		formData.assembly.processingCost = costCalculations.pCostAtAssemby;
		formData.assembly.addonCost = costCalculations.aCostAtAssemby;
		formData.assembly.extrasCost = costCalculations.eCostAtAssemby;
		formData.assembly.totalCost = costCalculations.wtAtSubAssembly + costCalculations.mtAtAssembly + costCalculations.pCostAtAssemby + costCalculations.aCostAtAssemby + costCalculations.eCostAtAssemby;
		callback()
	}
	//- to get a view of the page
	this.estimateViewData = function (estimateView, getLevelName, subAssemblyId, partId, callback) {

		var getViewData = [];

		if (estimateView == 'assembly') {
			getViewData = formData.assembly;
		} else if (estimateView == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			getViewData = formData.assembly.subAssemblies[subAssIndex];
		} else if (estimateView == 'partDetail') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			getViewData = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex];
		} else if (estimateView == 'editPartItemDetail') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);

			var estimatePartObj = {
				allShortcuts: [], //- get all presets name from API
				allPartTypes: [], //- get all part type from API

				selectedShortcut: {}, //- selected partType presets 
				selectedPartType: {}, //- selected partType
				selectedMaterial: {}, //- selected material     
				selectedSize: {}, //- slected size

				customMaterials: [], //- get all custom material from  API
				selectedCustomMaterial: {}, //- selecetd custom materail  

				quantity: null, //- part.quantity
				variables: [], //- part.variables
				shapeImage: null, //- get it from slected partPreset --> shape.shapeImage      
				shapeIcon: null, //- get it from slected partPreset --> shape.shapeIcon
				processingCount: null, //- part.processing.length
				addonCount: null, //- part.addons.length
				extraCount: null, //- part.extars.length

				partName: formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].partName, //- part.partName
				partNumber: null, //- part.partNumber 
				scaleFactor: null, //- part.scaleFactor

				keyValueCalculations: {
					perimeter: "", //- part.keyValueCalculation.perimeter
					sheetMetalArea: "", //- part.keyValueCalculation.sheetMetalArea
					surfaceArea: "", //- part.keyValueCalculation.surfaceArea
					weight: "" //- part.keyValueCalculation.weight
				},
				finalCalculation: {
					materialPrice: null, //- part.finalCalculation.materialPrice
					itemUnitPrice: null, //- part.finalCalculation.itemUnitPrice
					totalCostForQuantity: null //- part.finalCalculation.totalCostForQuantity
				},
				subAssNumber: subAssemblyId,
				partNumber: partId
			};

			//- get all shortcuts i.e. part presets 
			//- get all part types
			//- get all custom materials 
			NavigationService.boxCall('MPartPresets/getMPartPresetData', function (partPresetData) {
				estimatePartObj.allShortcuts = partPresetData.data;

				NavigationService.boxCall('MPartType/getPartTypeData', function (partTypeData) {
					estimatePartObj.allPartTypes = partTypeData.data;

					//- check part calculation data is available or not
					if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].partUpdateStatus) {

						var tempPart = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex];

						if (!_.isEmpty(tempPart.shortcut) && tempPart.shortcut != undefined) {
							estimatePartObj.selectedShortcut = tempPart.shortcut; //- selecetd shortCut
						}
						if (!_.isEmpty(tempPart.partType) && tempPart.partType != undefined) {
							estimatePartObj.selectedPartType = tempPart.partType; //- selected partType
						}
						if (!_.isEmpty(tempPart.material) && tempPart.material != undefined) {
							estimatePartObj.selectedMaterial = tempPart.material; //- selected material
						}
						if (!_.isEmpty(tempPart.size) && tempPart.size != undefined) {
							estimatePartObj.selectedSize = tempPart.size; //- size
						}
						if (!_.isEmpty(tempPart.customMaterial) && tempPart.customMaterial != undefined) {
							estimatePartObj.selectedCustomMaterial = tempPart.customMaterial; //- selectedCustomeMaterial
						}

						estimatePartObj.quantity = tempPart.quantity; //- quantity
						estimatePartObj.variable = tempPart.variable; //- variable

						estimatePartObj.finalCalculation.materialPrice = tempPart.finalCalculation.materialPrice;
						estimatePartObj.finalCalculation.itemUnitPrice = tempPart.finalCalculation.itemUnitPrice;
						estimatePartObj.finalCalculation.totalCostForQuantity = tempPart.finalCalculation.totalCostForQuantity

						estimatePartObj.keyValueCalculations.perimeter = tempPart.keyValueCalculations.perimeter;
						estimatePartObj.keyValueCalculations.sheetMetalArea = tempPart.keyValueCalculations.sheetMetalArea;
						estimatePartObj.keyValueCalculations.surfaceArea = tempPart.keyValueCalculations.surfaceArea;
						estimatePartObj.keyValueCalculations.weight = tempPart.keyValueCalculations.weight
						estimatePartObj.partUpdateStatus = true;

						callback(estimatePartObj);
					} else {
						callback(estimatePartObj);
					}

				});
			});
		} else if (estimateView == 'processing') {
			if (getLevelName == "assembly") {

				getViewData = formData.assembly.processing;
			} else if (getLevelName == "subAssembly") {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				getViewData = formData.assembly.subAssemblies[subAssIndex].processing;
				getViewData.subAssemblyId = formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
			} else if (getLevelName == "part") {

				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				getViewData = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing;
				getViewData.subAssemblyId = formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
				getViewData.partId = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].partNumber;
			}
		} else if (estimateView == 'addons') {
			if (getLevelName == "assembly") {
				getViewData = formData.assembly.addons;
			} else if (getLevelName == "subAssembly") {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				getViewData = formData.assembly.subAssemblies[subAssIndex].addons;
				getViewData.subAssemblyId = formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
			} else if (getLevelName == "part") {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				getViewData = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons;
				getViewData.subAssemblyId = formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
				getViewData.partId = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].partNumber;
			}
		} else if (estimateView == 'extras') {
			if (getLevelName == "assembly") {
				getViewData = formData.assembly.extras;
			} else if (getLevelName == "subAssembly") {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				getViewData = formData.assembly.subAssemblies[subAssIndex].extras;
				getViewData.subAssemblyId = formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
			} else if (getLevelName == "part") {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				getViewData = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras;
				getViewData.subAssemblyId = formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
				getViewData.partId = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].partNumber;
			}
		}

		//- this if is bcoz we are already sending callback in case of editPartItemDetail & partDetail view
		if (estimateView != 'editPartItemDetail' || estimateView != 'partDetail') {
			callback(getViewData);
		}

	}
	//- to save current estimate object
	this.saveCurrentEstimate = function () {
		NavigationService.apiCall('DraftEstimate/save', formData.assembly, function (data) {
			// $.jStorage.deleteKey("estimateObject");
			callback(data.data);
		});
	}
	//- to update assebly name
	this.editAssemblyName = function (estimateName, draftEstimateId, callback) {
		var tempEstimateObj = {
			_id: draftEstimateId,
			assemblyName: estimateName
		}
		NavigationService.apiCall('DraftEstimate/save', tempEstimateObj, function (data) {
			callback(data.data);
		});
	}


	//- to get all assembly numbers
	this.getAllAssemblyNumbers = function (callback) {
		NavigationService.boxCall('Estimate/getAllAssembliesNo', function (data) {
			callback(data.data);
		});
	}
	//- to get subAssembly data 
	this.getAllSubAssModalData = function (operation, subAssembly, callback) {
		var subAssDataObj = {}

		if (angular.isDefined(subAssembly)) {
			subAssDataObj.subAssObj = subAssembly;
		}
		if (operation == "save") {
			subAssDataObj.saveBtn = true;
			subAssDataObj.editBtn = false;
		} else if (operation == "update") {
			subAssDataObj.saveBtn = false;
			subAssDataObj.editBtn = true;
		}

		callback(subAssDataObj);
	}
	//- to get all subAssembly numbers
	this.getAllSubAssNumbers = function (callback) {
		// var subAssNumbersArray = [];
		// angular.forEach(formData.assembly.subAssemblies,  function (record) {
		// 	subAssNumbersArray.push(record.subAssemblyNumber);
		// });
		// _.remove(subAssNumbersArray, function (n) {
		// 	return n == subAssNumber;
		// });
		// callback(subAssNumbersArray);
		NavigationService.boxCall('EstimateSubAssembly/getVersionsOfSubAssNo', function (data) {
			callback(data.data);
		});
	}
	//- to add a subAssembly
	this.createSubAssembly = function (subAssObj, callback) {
		var id = this.getSubAssemblyNumber();
		var tempSubAssObj = _.cloneDeep(subAssembly);
		tempSubAssObj.subAssemblyNumber = formData.assembly.assemblyNumber + "SA" + id;
		tempSubAssObj.subAssemblyName = subAssObj.subAssemblyName;
		var tempObj = {
			perimeter: "",
			sheetMetalArea: "",
			surfaceArea: "",
			weight: ""
		}
		formData.assembly.keyValueCalculations = tempObj;
		formData.assembly.subAssemblies.push(tempSubAssObj);
		callback();
	}
	//- to delete a subAssembly
	this.deleteSubAssembly = function (subAssemblyId, callback) {
		_.remove(formData.assembly.subAssemblies, function (obj) {
			return obj.subAssemblyNumber == subAssemblyId;
		});
		callback();
	}
	//- to delete bulk subAssemblies
	this.deleteMultipleSubAssemblies = function (bulkArray, callback) {
		angular.forEach(bulkArray,  function (record) {
			_.remove(formData.assembly.subAssemblies, function (obj) {
				return record == obj.subAssemblyNumber;
			});
		});
		callback();
	}
	//- to get part data 
	this.getAllPartModalData = function (operation, subAssId, part, callback) {
		var partDataObj = {}

		if (angular.isDefined(part)) {
			partDataObj.partObj = part;
		}
		if (operation == "save") {
			partDataObj.saveBtn = true;
			partDataObj.editBtn = false;
			partDataObj.subAssId = subAssId;
		} else if (operation == "update") {
			partDataObj.saveBtn = false;
			partDataObj.editBtn = true;
		}
		callback(partDataObj)
	}
	//- to get all part numbers
	this.getAllPartNumbers = function (callback) {
		NavigationService.boxCall('EstimatePart/getVersionsOfPartNo', function (data) {
			callback(data.data);
		});
	}
	//- to add a part
	this.createPart = function (partObj, subAssId, callback) {
		var subAssIndex = this.getSubAssemblyIndex(subAssId);
		var id = this.getPartNumber(subAssIndex);
		var tempPartObj = _.cloneDeep(part);
		tempPartObj.partNumber = subAssId + 'PT' + id;
		tempPartObj.partName = partObj.partName;
		var tempObj = {
			perimeter: "",
			sheetMetalArea: "",
			surfaceArea: "",
			weight: ""
		}
		formData.assembly.keyValueCalculations = tempObj;
		formData.assembly.subAssemblies[subAssIndex].keyValueCalculations = tempObj;
		formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.push(tempPartObj);
		callback();
	}
	//- update Part Detail with all calculation & other data
	this.updatePartDetail = function (isEdit, partObject, callback) {
		//-make proper part Object by removing all unwanted fields 
		var subAssIndex = this.getSubAssemblyIndex(partObject.subAssNumber);
		var partIndex = this.getPartIndex(subAssIndex, partObject.partNumber);

		var tempPart = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex];

		if (!_.isEmpty(partObject.selectedShortcut) && partObject.selectedShortcut != undefined) {
			tempPart.shortcut = partObject.selectedShortcut; //- selecetd shortCut
		}
		if (!_.isEmpty(partObject.selectedPartType) && partObject.selectedPartType != undefined) {
			tempPart.partType = partObject.selectedPartType; //- selected partType
		}
		if (!_.isEmpty(partObject.selectedMaterial) && partObject.selectedMaterial != undefined) {
			tempPart.material = partObject.selectedMaterial; //- selected material
		}
		if (!_.isEmpty(partObject.selectedSize) && partObject.selectedSize != undefined) {
			tempPart.size = partObject.selectedSize; //- size
		}
		if (!_.isEmpty(partObject.selectedCustomMaterial) && partObject.selectedCustomMaterial != undefined) {
			tempPart.customMaterial = partObject.selectedCustomMaterial; //- selectedCustomeMaterial
		}

		tempPart.quantity = partObject.quantity; //- quantity
		tempPart.variable = partObject.variables; //- variables 
		tempPart.finalCalculation = {};
		tempPart.finalCalculation.materialPrice = partObject.finalCalculation.materialPrice;
		tempPart.finalCalculation.itemUnitPrice = partObject.finalCalculation.itemUnitPrice;
		tempPart.finalCalculation.totalCostForQuantity = partObject.finalCalculation.totalCostForQuantity
		tempPart.keyValueCalculations = {};
		tempPart.keyValueCalculations.perimeter = partObject.keyValueCalculations.perimeter;
		tempPart.keyValueCalculations.sheetMetalArea = partObject.keyValueCalculations.sheetMetalArea;
		tempPart.keyValueCalculations.surfaceArea = partObject.keyValueCalculations.surfaceArea;
		tempPart.keyValueCalculations.weight = partObject.keyValueCalculations.weight
		tempPart.partUpdateStatus = true;

		formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex] = tempPart;
		//- update calculaions at all levels
		if (isEdit) {
			this.KeyValueCalculations(formData.assembly.subAssemblies[subAssIndex].keyValueCalculations, formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (data) {
				if (!_.isEmpty(data)) {
					formData.assembly.subAssemblies[subAssIndex].keyValueCalculations = data;
				}
			});
			this.KeyValueCalculations(formData.assembly.keyValueCalculations, formData.assembly.subAssemblies, function (data) {
				if (!_.isEmpty(data)) {
					formData.assembly.keyValueCalculations = data;
				}
			});
		}
		callback(formData.assembly);
	}
	//- keyValue calculation
	this.KeyValueCalculations = function (level, records, callback) {
		var count = records.length;
		var tempObj = {
			perimeter: 0,
			sheetMetalArea: 0,
			surfaceArea: 0,
			weight: 0
		};
		//- to check access permission
		var temp = 0;
		if (level == 'subAssembly') {
			angular.forEach(records,  function (part) {
				if (!isNaN(parseFloat(part.keyValueCalculations.perimeter))) {
					tempObj.perimeter += parseFloat(part.keyValueCalculations.perimeter);
					temp += 1;
				}
				if (!isNaN(parseFloat(part.keyValueCalculations.sheetMetalArea))) {
					tempObj.sheetMetalArea += parseFloat(part.keyValueCalculations.sheetMetalArea);
					temp += 1;
				}
				if (!isNaN(parseFloat(part.keyValueCalculations.surfaceArea))) {
					tempObj.surfaceArea += parseFloat(part.keyValueCalculations.surfaceArea);
					temp += 1;
				}
				if (!isNaN(parseFloat(part.keyValueCalculations.weight))) {
					tempObj.weight += parseFloat(part.keyValueCalculations.weight);
					temp += 1;
				}
			});
		} else {
			angular.forEach(records,  function (subAssembly) {
				angular.forEach(subAssembly.subAssemblyParts,  function (part) {
					if (!isNaN(parseFloat(part.keyValueCalculations.perimeter))) {
						tempObj.perimeter += parseFloat(part.keyValueCalculations.perimeter);
						temp += 1;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.sheetMetalArea))) {
						tempObj.sheetMetalArea += parseFloat(part.keyValueCalculations.sheetMetalArea);
						temp += 1;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.surfaceArea))) {
						tempObj.surfaceArea += parseFloat(part.keyValueCalculations.surfaceArea);
						temp += 1;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.weight))) {
						tempObj.weight += parseFloat(part.keyValueCalculations.weight);
						temp += 1;
					}
				});	
			});
		}
		if (temp != 0) {
			callback(tempObj);
		} else {
			callback();
		}
	}
	//- to delete a part
	this.deletePart = function (subAssemblyId, partId, callback) {
		var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
		_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (obj) {
			return obj.partNumber == partId
		});
		callback();
	}
	//- to delete bulk parts
	this.deleteMultipleParts = function (subAssemblyId, bulkArray, callback) {
		subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
		angular.forEach(bulkArray,  function (record) {
			_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (obj) {
				return record == obj.partNumber;
			});
		});
		callback();
	}
	//- to add a duplicate part to same subAssembly
	this.formDuplicatePart = function (subAssId, partData, callback) {
		var duplicatePart = _.cloneDeep(partData);
		var subAssIndex = this.getSubAssemblyIndex(subAssId);
		var partCount = this.getPartNumber(subAssIndex);
		duplicatePart.partNumber = subAssId + 'PT' + partCount;
		duplicatePart.partName = this.generatePartName(subAssId).partName;
		var partIndex = this.getPartIndex(subAssIndex, duplicatePart.partNumber);

		angular.forEach(duplicatePart.processing,  function (obj) {
			var processingNumber = obj.processingNumber;
			temp2 = _.split(obj.processingNumber, 'PR');
			obj.processingNumber = duplicatePart.partNumber + 'PR' + temp2[1];
		});
		angular.forEach(duplicatePart.addons,  function (obj) {
			temp2 = _.split(obj.addonNumber, 'AD');
			obj.addonNumber = duplicatePart.partNumber + 'AD' + temp2[1];
		});
		angular.forEach(duplicatePart.extras,  function (obj) {
			temp2 = _.split(obj.extraNumber, 'EX');
			obj.extraNumber = duplicatePart.partNumber + 'EX' + temp2[1];
		});

		formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.push(duplicatePart);
		callback();
	}
	//- for automatic generation of part name for new addition of part
	this.generatePartName = function (subAssId) {

		var subAssIndex = this.getSubAssemblyIndex(subAssId);
		var id = this.getPartNumber(subAssIndex);
		var obj = {
			partName: (subAssId + 'PT' + id)
		};
		return obj;
	}




	//- to get the required data in order to add / edit processing at any level
	this.getProcessingModalData = function (operation, level, subAssemblyId, partId, processId, callback) {

		var partProcessingObj = {
			processingTypeData: [],
			processingItemData: [],
			selectedProcessingType: {},
			selectedProcessingItem: {},
			rate: {
				actualRate: null
			},
			quantity: {
				linkedKeyValue: {
					keyVariable: null,
					keyValue: null
				},
				totalQuantity: null,
				utilization: null,
				contengncyOrWastage: null
			},
			remark: "",
			totalCost: null,

			linkedKeyValuesCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				weight: null
			},

			linkedKeyValuesAtPartCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				weight: null
			},
			linkedKeyValuesAtSubAssemblyCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				weight: null
			},
			linkedKeyValuesAtAssemblyCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				weight: null
			}
		};


		//- to get keyValue calculations
		if (level == 'part') {
			//- get linkedKeyValue object from the part on the base of provided subAssemblyId, partId
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			partProcessingObj.linkedKeyValuesAtPartCalculation = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].keyValueCalculations;
		} else if (level == 'subAssembly') {
			//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding subAssembly		
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			this.KeyValueCalculations(level, formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (data) {
				if (!_.isEmpty(data)) {
					partProcessingObj.linkedKeyValuesAtSubAssemblyCalculation = data;
				}
			});
		} else if (level == 'assembly') {
			//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding assembly
			//- i.e  calculate all linkedKeyValuesAtSubAssemblyCalculation for all subAssemblies 
			//- & then calculate average of all linkedKeyValuesAtSubAssemblyCalculation
			this.KeyValueCalculations(level, formData.assembly.subAssemblies, function (data) {
				if (!_.isEmpty(data)) {
					partProcessingObj.linkedKeyValuesAtAssemblyCalculation = data;
				}
			});
		}

		//- to get part index to update it
		if (operation == 'update') {
			if (level == 'assembly') {
				var getProcessingIndex = this.getProcessIndex(processId);
				var tempProcessingObj = formData.assembly.processing[getProcessingIndex];
			} else if (level == 'subAssembly') {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var getProcessingIndex = this.getProcessIndex(processId, subAssIndex);
				var tempProcessingObj = formData.assembly.subAssemblies[subAssIndex].processing[getProcessingIndex];
			} else {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				var getProcessingIndex = this.getProcessIndex(processId, subAssIndex, partIndex);
				var tempProcessingObj = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing[getProcessingIndex];
			}
		}

		NavigationService.boxCall('MProcessType/getProcessTypeData', function (proTypeData) {

			if (operation == 'save') {
				partProcessingObj.processingTypeData = proTypeData.data;
				callback(partProcessingObj);
			} else if (operation == 'update') {


				NavigationService.apiCall('MProcessType/getProcessTypeItem', {
					_id: tempProcessingObj.processType._id
				}, function (selecetdProcessItem) {

					partProcessingObj.processingNumber = tempProcessingObj.processingNumber;
					partProcessingObj.processingTypeData = proTypeData.data;
					partProcessingObj.processingItemData = selecetdProcessItem.data.processItems;
					partProcessingObj.selectedProcessingType = tempProcessingObj.processType;
					partProcessingObj.selectedProcessingItem = tempProcessingObj.processItem;

					partProcessingObj.rate.actualRate = tempProcessingObj.rate;
					// partProcessingObj.rate.uom = tempProcessingObj.rate.uom;

					partProcessingObj.quantity.linkedKeyValue.keyVariable = tempProcessingObj.quantity.linkedKeyValue.keyVariable;
					partProcessingObj.quantity.linkedKeyValue.keyValue = tempProcessingObj.quantity.linkedKeyValue.keyValue;
					partProcessingObj.quantity.utilization = tempProcessingObj.quantity.utilization;
					partProcessingObj.quantity.contengncyOrWastage = tempProcessingObj.quantity.contengncyOrWastage;
					partProcessingObj.quantity.totalQuantity = tempProcessingObj.quantity.totalQuantity;

					partProcessingObj.finalUom = tempProcessingObj.processType.quantity.finalUom.uomName;;
					partProcessingObj.remark = tempProcessingObj.remark;
					// partProcessingObj.quantity.uom = tempProcessingObj.quantity.uom;
					// partProcessingObj.quantity.mulFact = tempProcessingObj.quantity.mulFact;
					//partProcessingObj.currentPartObj = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex];

					callback(partProcessingObj);

				});
			}
		});
	}
	//- called when user will select a processType while adding a processing at any level
	this.getSelectedProessType = function (processTypeId, callback) {
		NavigationService.apiCall('MProcessType/getProcessTypeItem', {
			_id: processTypeId
		}, function (data) {
			callback(data.data.processItems);
		});
	}

	// this.getSelectedProessItem = function (processItemId,callback) {
	// 	NavigationService.apiCall('model_name/function_name', {_id:processItemId}, function (data) {
	// 		callback(data.data);
	// 	});
	// }

	//- to add a processing
	this.createProcessing = function (processingObj, level, subAssemblyId, partId, callback) {

		var id;
		if (level == 'assembly') {
			id = this.getProcessingNumber(level);
			processingObj.processingNumber = formData.assembly.assemblyNumber + 'PR' + id;
			formData.assembly.processing.push(processingObj);
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			id = this.getProcessingNumber(level, subAssIndex);
			processingObj.processingNumber = subAssemblyId + 'PR' + id;
			formData.assembly.subAssemblies[subAssIndex].processing.push(processingObj);
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			id = this.getProcessingNumber(level, subAssIndex, partIndex);
			processingObj.processingNumber = partId + 'PR' + id;
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing.push(processingObj);
		}
		callback();
	}
	//- edit/update created processing 
	this.updateProcessing = function (processingData, level, subAssemblyId, partId, callback) {
		var id;
		if (level == 'assembly') {
			var getProcessingIndex = this.getProcessIndex(processingData.processingNumber);
			var tempProcessOject = formData.assembly.processing[getProcessingIndex];
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var getProcessingIndex = this.getProcessIndex(processingData.processingNumber, subAssIndex);
			var tempProcessOject = formData.assembly.subAssemblies[subAssIndex].processing[getProcessingIndex];
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			var getProcessingIndex = this.getProcessIndex(processingData.processingNumber, subAssIndex, partIndex);
			var tempProcessOject = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing[getProcessingIndex];
		}
		tempProcessOject.processType = processingData.processType;
		tempProcessOject.processItem = processingData.processItem;
		tempProcessOject.rate = processingData.rate;
		tempProcessOject.quantity = {
				linkedKeyValue: {
					keyVariable: processingData.quantity.linkedKeyValue.keyVariable,
					keyValue: processingData.quantity.linkedKeyValue.keyValue
				},
				totalQuantity: processingData.quantity.totalQuantity,
				utilization: processingData.quantity.utilization,
				contengncyOrWastage: processingData.quantity.contengncyOrWastage
			},
			tempProcessOject.remark = processingData.remark;
		tempProcessOject.totalCost = processingData.totalCost;

		if (level == 'assembly') {
			formData.assembly.processing[getProcessingIndex] = tempProcessOject;
		} else if (level == 'subAssembly') {
			formData.assembly.subAssemblies[subAssIndex].processing[getProcessingIndex] = tempProcessOject;
		} else if (level == 'part') {
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing[getProcessingIndex] = tempProcessOject;
		}
		callback();
	}
	//- to delete a processing
	this.deleteProcessing = function (processingId, level, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			_.remove(formData.assembly.processing, function (obj) {
				return obj.processingNumber == processingId
			});
		} else if (level == 'subAssembly') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			_.remove(formData.assembly.subAssemblies[subAssIndex].processing, function (obj) {
				return obj.processingNumber == processingId
			});
		} else if (level == 'part') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			partIndex = this.getPartIndex(subAssIndex, partId);
			_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing, function (obj) {
				return obj.processingNumber == processingId
			});
		}
		callback();
	}
	//- to delete bulk processing
	this.deleteMultipleProcessing = function (level, bulkIds, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.processing, function (obj) {
					return record == obj.processingNumber;
				});
			});
		} else if (level == 'subAssembly') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.subAssemblies[subAssIndex].processing, function (obj) {
					return record == obj.processingNumber;
				});
			});
		} else if (level == 'part') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			partIndex = this.getPartIndex(subAssIndex, partId);
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing, function (obj) {
					return record == obj.processingNumber;
				});
			});
		}
		bulkArray = [];
		callback();
	}


	//- to get the required data in order to add / edit addon at any level
	this.getAddonModalData = function (operation, level, subAssemblyId, partId, addonId, callback) {
		var addonObject = {
			allAddonTypes: [],
			allMaterials: [],
			selectedAddonType: {},
			selectedMaterial: {},
			rate: {
				value: "",
				uom: ""
			},
			quantity: {
				supportingVariable: {
					supportingVariable: "",
					value: ""
				},
				keyValue: {
					keyVariable: "",
					keyValue: ""
				},
				utilization: "",

			},
			linkedKeyValuesAtPartCalculation: {
				perimeter: null,
				SMA: null,
				SA: null,
				St: null,
				Nos: null,
				Hrs: null
			},
			linkedKeyValuesAtSubAssemblyCalculation: {
				perimeter: null,
				SMA: null,
				SA: null,
				St: null,
				Nos: null,
				Hrs: null
			},
			linkedKeyValuesAtAssemblyCalculation: {
				perimeter: null,
				SMA: null,
				SA: null,
				St: null,
				Nos: null,
				Hrs: null
			}
		};

		//- to get keyValue calculations
		if (level == 'part') {
			//- get linkedKeyValue object from the part on the base of provided subAssemblyId, partId
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			var tempPartCal = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].keyValueCalculations;
			addonObject.linkedKeyValuesAtPartCalculation = {
				perimeter: tempPartCal.perimeter,
				SMA: tempPartCal.sheetMetalArea,
				SA: tempPartCal.surfaceArea,
				Wt: tempPartCal.weight,
				Nos: null,
				Hrs: null
			};
		} else if (level == 'subAssembly') {
			//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding subAssembly
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			this.KeyValueCalculations(level, formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (data) {
				if (!_.isEmpty(data)) {
					addonObject.linkedKeyValuesAtSubAssemblyCalculation =  {
						perimeter: data.perimeter,
						SMA: data.sheetMetalArea,
						SA: data.surfaceArea,
						Wt: data.weight,
						Nos: null,
						Hrs: null
					};
				}
			});
		} else if (level == 'assembly') {
			//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding assembly
			//- i.e  calculate all linkedKeyValuesAtSubAssemblyCalculation for all subAssemblies 
			//- & then calculate average of all linkedKeyValuesAtSubAssemblyCalculation
			this.KeyValueCalculations(level, formData.assembly.subAssemblies, function (data) {
				if (!_.isEmpty(data)) {
					addonObject.linkedKeyValuesAtAssemblyCalculation = {
						perimeter: data.perimeter,
						SMA: data.sheetMetalArea,
						SA: data.surfaceArea,
						Wt: data.weight,
						Nos: null,
						Hrs: null
					};
				}
			});
		}

		//- to get part index to update it
		if (operation == 'update') {
			if (level == 'assembly') {
				var getAddonIndex = this.getAddonIndex(addonId);
				var tempAddonObj = formData.assembly.addons[getAddonIndex];
			} else if (level == 'subAssembly') {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var getAddonIndex = this.getAddonIndex(addonId, subAssIndex);
				var tempAddonObj = formData.assembly.subAssemblies[subAssIndex].addons[getAddonIndex];
			} else {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				var getAddonIndex = this.getAddonIndex(addonId, subAssIndex, partIndex);
				var tempAddonObj = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons[getAddonIndex];
				console.log('**** inside getAddonModalData of createOrEditEstimateService.js ****', tempAddonObj);
			}
		}

		NavigationService.boxCall('MAddonType/getAllMAddonTypeOfMuom', function (addonTypeData) {
			if (operation == 'save') {
				addonObject.allAddonTypes = addonTypeData.data;
				callback(addonObject);
			} else if (operation == 'update') {

				NavigationService.apiCall('MMaterial/getAllMaterials', {
					_id: tempAddonObj.addonType._id
				}, function (getAllMaterials) {

					addonObject.allAddonTypes = addonTypeData.data;
					addonObject.allMaterials = getAllMaterials.data;
					addonObject.selectedAddonType = tempAddonObj.addonType;
					addonObject.selectedMaterial = tempAddonObj.addonItem;

					addonObject.rate.value = tempAddonObj.rate;
					addonObject.rate.uom = tempAddonObj.addonType.rate.uom.uomName;

					addonObject.quantity.supportingVariable.supportingVariable = tempAddonObj.quantity.supportingVariable.supportingVariable;
					addonObject.quantity.supportingVariable.value = tempAddonObj.quantity.supportingVariable.value;
					addonObject.quantity.supportingVariable.uom = tempAddonObj.addonType.quantity.additionalInputUom.uomName;

					addonObject.quantity.keyValue.keyVariable = tempAddonObj.quantity.keyValue.keyVariable;
					addonObject.quantity.keyValue.keyValue = tempAddonObj.quantity.keyValue.keyValue;
					addonObject.quantity.keyValue.uom = tempAddonObj.addonType.quantity.linkedKeyUom.uomName;

					addonObject.quantity.utilization = tempAddonObj.quantity.utilization;
					addonObject.quantity.contengncyOrWastage = tempAddonObj.quantity.contengncyOrWastage;
					addonObject.quantity.total = tempAddonObj.quantity.total;
					addonObject.remarks = tempAddonObj.remarks;

					addonObject.addonNumber = tempAddonObj.addonNumber;


					callback(addonObject);
				});
			}
		});
	}
	//- called when user will select a processType while adding a processing at any level
	this.getSelectedAddonType = function (addonTypeId, callback) {
		debugger;
		NavigationService.apiCall('MAddonType/getAddonMaterial', {
			_id: addonTypeId
		}, function (data) {
			callback(data.data.materials);
		});
	}

	this.getAddonTypeData = function (callback) {}

	//- to add an addon
	this.createAddon = function (addonObj, level, subAssemblyId, partId, callback) {
		var id;
		if (level == 'assembly') {
			id = this.getAddonNumber(level);
			addonObj.addonNumber = formData.assembly.assemblyNumber + 'AD' + id;
			formData.assembly.addons.push(addonObj);
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			id = this.getAddonNumber(level, subAssIndex);
			addonObj.addonNumber = subAssemblyId + 'AD' + id;
			formData.assembly.subAssemblies[subAssIndex].addons.push(addonObj);
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			id = this.getAddonNumber(level, subAssIndex, partIndex);
			addonObj.addonNumber = partId + 'AD' + id;
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons.push(addonObj);
		}
		callback();
	}
	//- edit/update created processing 
	this.updateAddon = function (addonData, level, subAssemblyId, partId, callback) {
		var id;
		if (level == 'assembly') {
			var getAddonIndex = this.getAddonIndex(addonData.addonNumber);
			var tempAddonObject = formData.assembly.addons[getAddonIndex];
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var getAddonIndex = this.getAddonIndex(addonData.addonNumber, subAssIndex);
			var tempAddonObject = formData.assembly.subAssemblies[subAssIndex].addons[getAddonIndex];
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			var getAddonIndex = this.getAddonIndex(addonData.addonNumber, subAssIndex, partIndex);
			var tempAddonObject = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons[getAddonIndex];
		}

		tempAddonObject.addonNumber = addonData.addonNumber;
		tempAddonObject.addonType = addonData.addonType;
		tempAddonObject.addonItem = addonData.addonItem;

		tempAddonObject.rate = addonData.rate;

		tempAddonObject.quantity.keyValue.keyValue = addonData.quantity.keyValue.keyValue;
		tempAddonObject.quantity.keyValue.keyVariable = addonData.quantity.keyValue.keyVariable;
		tempAddonObject.quantity.supportingVariable.value = addonData.quantity.supportingVariable.value;
		tempAddonObject.quantity.supportingVariable.supportingVariable = addonData.quantity.supportingVariable.supportingVariabl;
		tempAddonObject.quantity.total = addonData.quantity.total;
		tempAddonObject.quantity.contengncyOrWastage = addonData.quantity.contengncyOrWastage;
		tempAddonObject.quantity.utilization = addonData.quantity.utilization;

		tempAddonObject.remark = addonData.remark;
		tempAddonObject.totalCost = addonData.totalCost;

		if (level == 'assembly') {
			formData.assembly.addons[getAddonIndex] = tempAddonObject;
		} else if (level == 'subAssembly') {
			formData.assembly.subAssemblies[subAssIndex].addons[getAddonIndex] = tempAddonObject;
		} else if (level == 'part') {
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons[getAddonIndex] = tempAddonObject;
		}

		callback();
	}
	//- to delete an addon
	this.deleteAddon = function (addonId, level, subAssemblyId, partId, callback) {

		if (level == 'assembly') {
			_.remove(formData.assembly.addons, function (obj) {
				return obj.addonNumber == addonId
			});
		} else if (level == 'subAssembly') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			_.remove(formData.assembly.subAssemblies[subAssIndex].addons, function (obj) {
				return obj.addonNumber == addonId
			});
		} else if (level == 'part') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			partIndex = this.getPartIndex(subAssIndex, partId);
			_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons, function (obj) {
				return obj.addonNumber == addonId
			});
		}
		callback();
	}
	//- to delete bulk addons
	this.deleteMultipleAddons = function (level, bulkIds, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.addons, function (obj) {
					return record == obj.addonNumber;
				});
			});
		} else if (level == 'subAssembly') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.subAssemblies[subAssIndex].addons, function (obj) {
					return record == obj.addonNumber;
				});
			});
		} else if (level == 'part') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			partIndex = this.getPartIndex(subAssIndex, partId);
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons, function (obj) {
					return record == obj.addonNumber;
				});
			});
		}
		bulkArray = [];
		callback();
	}



	//- to get customer data
	this.getCustomMaterialModalData = function (operation, customMaterial, callback) {
		var custMaterialDataObj = {}

		if (angular.isDefined(customMaterial)) {
			custMaterialDataObj.custMaterialObj = customMaterial;
		}
		if (operation == "save") {
			custMaterialDataObj.saveBtn = true;
			custMaterialDataObj.editBtn = false;
		} else if (operation == "update") {
			custMaterialDataObj.saveBtn = false;
			custMaterialDataObj.editBtn = true;
		}

		callback(custMaterialDataObj)

	}
	//- to save customer material object
	this.createCustomMaterial = function (customMaterialObj) {
		// NavigationService.apiCall('/save', customMaterialObj, function (data) {
		// 	callback(data.data);
		//});
	}


	this.getAddonTypeData = function (callback) {}

	//- to get index of subAssId
	this.getSubAssemblyIndex = function (subAssId) {

		var subAssIndex = _.findIndex(formData.assembly.subAssemblies, {
			subAssemblyNumber: subAssId
		});

		return subAssIndex;
	}
	//- to get index of partId
	this.getPartIndex = function (subAssIndex, partId) {

		var partIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, ['partNumber', partId]);
		return partIndex;
	}
	//- to get index of processId
	this.getProcessIndex = function (processId, subAssIndex, partIndex) {
		var processIndex;
		if (angular.isDefined(subAssIndex)) {
			if (angular.isDefined(partIndex)) {
				processIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing, ['processingNumber', processId]);

			} else {
				processIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].processing, ['processingNumber', processId]);
			}
		} else {
			processIndex = _.findIndex(formData.assembly.processing, ['processingNumber', processId]);
		}
		return processIndex;
	}
	//- to get index of addonId
	this.getAddonIndex = function (addonId, subAssIndex, partIndex) {
		var addonIndex;
		if (angular.isDefined(subAssIndex)) {
			if (angular.isDefined(partIndex)) {
				addonIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons, ['addonNumber', addonId]);
			} else {
				addonIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].addons, ['addonNumber', addonId]);
			}
		} else {
			addonIndex = _.findIndex(formData.assembly.addons, ['addonNumber', addonId]);
		}
		return addonIndex;
	}
	//- to get index of extraId
	this.getExtraIndex = function (extraId, subAssIndex, partIndex) {
		var extraIndex;
		if (angular.isDefined(subAssIndex)) {
			if (angular.isDefined(partIndex)) {
				extraIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras, ['extraNumber', extraId]);
			} else {
				extraIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].extras, ['extraNumber', extraId]);
			}
		} else {
			extraIndex = _.findIndex(formData.assembly.extras, ['extraNumber', extraId]);
		}
		return extraIndex;
	}



	//- to get subAssembly number for new addition of record
	this.getSubAssemblyNumber = function () {

		var id;
		if (formData.assembly.subAssemblies.length == 0) {
			id = 1;
		} else {
			temp = _.last(formData.assembly.subAssemblies).subAssemblyNumber;
			temp = _.split(temp, 'SA');
			id = _.toNumber(temp[1]) + 1;
		}

		return id;
	}
	//- to get part number for new addition of record
	this.getPartNumber = function (subAssIndex) {
		var id;
		if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.length == 0) {
			id = 1;
		} else {
			temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts).partNumber;
			temp = _.split(temp, 'PT');
			id = _.toNumber(temp[1]) + 1;
		}

		return id;
	}
	//- to get processing number for new addition of record
	this.getProcessingNumber = function (level, subAssIndex, partIndex) {
		var id;
		if (level == 'assembly') {
			if (formData.assembly.processing.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.processing).processingNumber;
			}

		} else if (level == 'subAssembly') {
			if (formData.assembly.subAssemblies[subAssIndex].processing.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].processing).processingNumber;
			}

		} else if (level == 'part') {
			if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing).processingNumber;
			}
		}

		temp = _.split(temp, 'PR');
		id = _.toNumber(temp[1]) + 1;

		return id;
	}
	//- to get addon number for new addition of record
	this.getAddonNumber = function (level, subAssIndex, partIndex) {
		var id;
		if (level == 'assembly') {
			if (formData.assembly.addons.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.addons).addonNumber;
			}

		} else if (level == 'subAssembly') {
			if (formData.assembly.subAssemblies[subAssIndex].addons.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].addons).addonNumber;
			}

		} else if (level == 'part') {
			if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons).addonNumber;
			}
		}

		temp = _.split(temp, 'AD');
		id = _.toNumber(temp[1]) + 1;

		return id;
	}
	//- to get extra number for new addition of record
	this.getExtraNumber = function (level, subAssIndex, partIndex) {
		var id;
		if (level == 'assembly') {
			if (formData.assembly.extras.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.extras).extraNumber;
			}

		} else if (level == 'subAssembly') {
			if (formData.assembly.subAssemblies[subAssIndex].extras.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].extras).extraNumber;
			}

		} else if (level == 'part') {
			if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras.length == 0) {
				id = 1;
				return id;
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras).extraNumber;
			}
		}

		temp = _.split(temp, 'EX');
		id = _.toNumber(temp[1]) + 1;

		return id;
	}



	//- to import subAssembly
	this.getImportSubAssemblyData = function (subAssId, callback) {
		temp = _.last(formData.assembly.subAssemblies).subAssemblyNumber;
		tempObj = {
			_id: subAssId,
			lastSubAssemblyNumber: temp
		}
		NavigationService.apiCall('EstimateSubAssembly/importSubAssembly', tempObj, function (data) {
			var subAssObj = data.data.subAssemblyObj;
			subAssObj.subAssemblyName = subAssObj.subAssemblyNumber;
			formData.assembly.subAssemblies.push(subAssObj);
			callback();
		});
	}
	//- to import part
	this.getImportPartData = function (subAssNumber, partId, callback) {
		var subAssIndex = this.getSubAssemblyIndex(subAssNumber);
		if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.length == 0) {
			temp = formData.assembly.assemblyNumber + 'PT0';
		} else {
			temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts).partNumber;
		}
		tempObj = {
			lastPartNumber: temp,
			_id: partId
		}
		NavigationService.apiCall('EstimatePart/importPart', tempObj, function (data) {
			var partObj = data.data.partObj;
			partObj.partName = partObj.partNumber;
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.push(partObj);
			callback();
		});
	}
	//- to import processing
	this.getImportProcessingData = function (processingId, level, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			if (formData.assembly.processing.length == 0) {
				temp = formData.assembly.assemblyNumber + 'PR0';
			} else {
				temp = _.last(formData.assembly.processing).processingNumber;
			}
			tempObj = {
				_id: processingId,
				lastProcessingNumber: temp
			}
			NavigationService.apiCall('EstimateProcessing/importProcessing', tempObj, function (data) {
				formData.assembly.processing.push(data.data);
			});

		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			if (formData.assembly.subAssemblies[subAssIndex].processing.length == 0) {
				temp = subAssemblyId + 'EX0';
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].processing).processingNumber;
			}
			tempObj = {
				_id: processingId,
				lastProcessingNumber: temp
			}
			NavigationService.apiCall('EstimateProcessing/importProcessing', tempObj, function (data) {
				formData.assembly.subAssemblies[subAssIndex].processing.push(data.data);
			});
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing.length == 0) {
				temp = partId + 'EX0';
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing).processingNumber;
			}
			tempObj = {
				_id: processingId,
				lastProcessingNumber: temp
			}
			NavigationService.apiCall('EstimateProcessing/importProcessing', tempObj, function (data) {
				formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing.push(data.data)
			});
		}
		callback();
	}
	//- to import addon
	this.getImportAddonData = function (addonId, level, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			if (formData.assembly.addons.length == 0) {
				temp = formData.assembly.assemblyNumber + 'AD0';
			} else {
				temp = _.last(formData.assembly.addons).addonNumber;
			}
			tempObj = {
				_id: addonId,
				lastAddonNumber: temp
			}
			NavigationService.apiCall('EstimateAddons/importAddon', tempObj, function (data) {
				formData.assembly.addons.push(data.data);
			});
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			if (formData.assembly.subAssemblies[subAssIndex].addons.length == 0) {
				temp = subAssemblyId + 'AD0';
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].addons).addonNumber;
			}
			tempObj = {
				_id: addonId,
				lastAddonNumber: temp
			}
			NavigationService.apiCall('EstimateAddons/importAddon', tempObj, function (data) {
				formData.assembly.subAssemblies[subAssIndex].addons.push(data.data);
			});
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons.length == 0) {
				temp = partId + 'AD0';
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons).addonNumber;
			}
			tempObj = {
				_id: addonId,
				lastAddonNumber: temp
			}
			NavigationService.apiCall('EstimateAddons/importAddon', tempObj, function (data) {
				formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons.push(data.data)
			});

		}
		callback();
	}
	//- to import extra
	this.getImportExtraData = function (extraId, level, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			if (formData.assembly.extras.length == 0) {
				temp = formData.assembly.assemblyNumber + 'EX0';
			} else {
				temp = _.last(formData.assembly.extras).extraNumber;
			}
			tempObj = {
				_id: extraId,
				lastExtraNumber: temp
			}
			NavigationService.apiCall('EstimateExtras/importExtra', tempObj, function (data) {
				formData.assembly.extras.push(data.data);
			});

		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			if (formData.assembly.subAssemblies[subAssIndex].extras.length == 0) {
				temp = subAssemblyId + 'EX0';
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].extras).extraNumber;
			}
			tempObj = {
				_id: extraId,
				lastExtraNumber: temp
			}
			NavigationService.apiCall('EstimateExtras/importExtra', tempObj, function (data) {
				formData.assembly.subAssemblies[subAssIndex].extras.push(data.data);
			});

		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			if (formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras.length == 0) {
				temp = partId + 'EX0';
			} else {
				temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras).extraNumber;
			}
			tempObj = {
				_id: extraId,
				lastExtraNumber: temp
			}
			NavigationService.apiCall('EstimateExtras/importExtra', tempObj, function (data) {
				formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras.push(data.data)
			});

		}
		callback();
	}



	//- to get numbers of processing/addons/extras present in assembly object
	this.getAllItemNumbers = function (type, callback) {
		if (type == "Processing") {
			NavigationService.boxCall('EstimateProcessing/getVersionsOfProcessingNo', function (data) {
				callback(data.data);
			});
		} else if (type == "Addon") {
			NavigationService.boxCall('EstimateAddons/getVersionsOfAddonsNo', function (data) {
				callback(data.data);
			});
		} else {
			NavigationService.boxCall('EstimateExtras/getVersionsOfExtrasNo', function (data) {
				callback(data.data);
			});
		}
	}
	//- form an array of bulk Ids
	this.selectBulkItems = function (checkboxStatus, itemId, callback) {

		if (checkboxStatus == true) {
			bulkArray.push(itemId);
		} else {
			_.remove(bulkArray, function (record) {
				return record == itemId;
			});
		}
		callback(bulkArray);
	}
	//- form an array of Ids of all items for deletion
	this.selectAll = function (type, level, itemData, checkboxStatus, subAssId, partId, callback) {
		bulkArray = [];
		if (checkboxStatus == true) {
			if (type == 'processing') {
				if (level == 'assembly') {
					angular.forEach(formData.assembly.processing,  function (obj) {
						bulkArray.push(obj.processingNumber);
					});
				} else if (level == 'subAssembly') {
					subAssIndex = this.getSubAssemblyIndex(subAssId);
					angular.forEach(formData.assembly.subAssemblies[subAssIndex].processing,  function (obj) {
						bulkArray.push(obj.processingNumber);
					});
				} else if (level == 'part') {
					subAssIndex = this.getSubAssemblyIndex(subAssId);
					partIndex = this.getPartIndex(subAssIndex, partId);
					angular.forEach(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing,  function (obj) {
						bulkArray.push(obj.processingNumber);
					});
				}
			} else if (type == 'addons') {
				if (level == 'assembly') {
					angular.forEach(formData.assembly.addons,  function (obj) {
						bulkArray.push(obj.addonNumber);
					});
				} else if (level == 'subAssembly') {
					subAssIndex = this.getSubAssemblyIndex(subAssId);
					angular.forEach(formData.assembly.subAssemblies[subAssIndex].addons,  function (obj) {
						bulkArray.push(obj.addonNumber);
					});
				} else if (level == 'part') {
					subAssIndex = this.getSubAssemblyIndex(subAssId);
					partIndex = this.getPartIndex(subAssIndex, partId);
					angular.forEach(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons,  function (obj) {
						bulkArray.push(obj.addonNumber);
					});
				}
			} else if (type == 'extras') {
				if (level == 'assembly') {
					angular.forEach(formData.assembly.extras,  function (obj) {
						bulkArray.push(obj.extraNumber);
					});
				} else if (level == 'subAssembly') {
					subAssIndex = this.getSubAssemblyIndex(subAssId);
					angular.forEach(formData.assembly.subAssemblies[subAssIndex].extras,  function (obj) {
						bulkArray.push(obj.extraNumber);
					});
				} else if (level == 'part') {
					subAssIndex = this.getSubAssemblyIndex(subAssId);
					partIndex = this.getPartIndex(subAssIndex, partId);
					angular.forEach(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras,  function (obj) {
						bulkArray.push(obj.extraNumber);
					});
				}
			} else if (type == 'subAssembly') {
				angular.forEach(formData.assembly.subAssemblies,  function (obj) {
					bulkArray.push(obj.subAssemblyNumber);
				});
			} else if (type == 'part') {
				subAssIndex = this.getSubAssemblyIndex(subAssId);
				angular.forEach(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts,  function (obj) {
					bulkArray.push(obj.partNumber);
				});
			}
		}
		callback(bulkArray);
	}

	//**********************************extra ***********************************************

	this.getExtraModalData = function (operation, level, subAssemblyId, partId, extraId, callback) {
		var extraObj = {
			selecetdExtraItem: {},
			allExtraItem: [],
			quantity: 1,
			remark: "",
			totalCost: "",
			rate: "",
			uom: ""
		};
		if (operation == 'update') {;
			if (level == 'assembly') {
				var extraIndex = this.getExtraIndex(extraId);
				var tempExtraObj = formData.assembly.extras[extraIndex];
			} else if (level == 'subAssembly') {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var extraIndex = this.getExtraIndex(extraId, subAssIndex);
				var tempExtraObj = formData.assembly.subAssemblies[subAssIndex].extras[extraIndex];
			} else if (level == 'part') {
				var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
				var partIndex = this.getPartIndex(subAssIndex, partId);
				var extraIndex = this.getExtraIndex(extraId, subAssIndex, partIndex);
				var tempExtraObj = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras[extraIndex];
			}
		}

		NavigationService.boxCall('MExtra/getMExtraData', function (data) {

			if (operation == 'save') {
				extraObj.allExtraItem = data.data;
			} else {;
				extraObj.allExtraItem = data.data;
				extraObj.extraItem = tempExtraObj.extraItem,
					extraObj.extraNumber = tempExtraObj.extraNumber,
					extraObj.totalCost = tempExtraObj.totalCost,
					extraObj.remark = tempExtraObj.remark,
					extraObj.quantity = tempExtraObj.quantity,
					extraObj.rate = tempExtraObj.rate,
					extraObj.uom = tempExtraObj.uom
			}
			callback(extraObj);
		});

	}

	//- to update an extra
	this.updateExtra = function (extraObj, level, subAssemblyId, partId, extraId, callback) {
		if (level == 'assembly') {
			var extraIndex = this.getExtraIndex(extraObj.extraNumber);
			var tempExtraObj = formData.assembly.extras[extraIndex];
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var extraIndex = this.getExtraIndex(extraObj.extraNumber, subAssIndex);
			var tempExtraObj = formData.assembly.subAssemblies[subAssIndex].extras[extraIndex];
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			var extraIndex = this.getExtraIndex(extraObj.extraNumber, subAssIndex, partIndex);
			var tempExtraObj = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras[extraIndex];
		}
		tempExtraObj.extraItem = extraObj.selectedExtraItem.extraName,
			tempExtraObj.extraNumber = extraObj.extraNumber,
			tempExtraObj.totalCost = extraObj.totalCost,
			tempExtraObj.remark = extraObj.remark,
			tempExtraObj.quantity = extraObj.quantity,
			tempExtraObj.rate = extraObj.rate,
			tempExtraObj.uom = extraObj.uom

		callback();
	}

	//- to add an extra
	this.addExtra = function (extraObj, level, subAssemblyId, partId, callback) {
		var id;
		if (level == 'assembly') {
			id = this.getExtraNumber(level);
			extraObj.extraNumber = 'AS1' + 'EX' + id;
			formData.assembly.extras.push(extraObj);
		} else if (level == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			id = this.getExtraNumber(level, subAssIndex);
			extraObj.extraNumber = subAssemblyId + 'EX' + id;
			formData.assembly.subAssemblies[subAssIndex].extras.push(extraObj);
		} else if (level == 'part') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);
			id = this.getExtraNumber(level, subAssIndex, partIndex);
			extraObj.extraNumber = partId + 'EX' + id;
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras.push(extraObj);
		}
		callback();
	}
	//- to delete an extra
	this.deleteExtra = function (extraId, level, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			_.remove(formData.assembly.extras, function (obj) {
				return obj.extraNumber == extraId
			});
		} else if (level == 'subAssembly') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			_.remove(formData.assembly.subAssemblies[subAssIndex].extras, function (obj) {
				return obj.extraNumber == extraId
			});
		} else if (level == 'part') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			partIndex = this.getPartIndex(subAssIndex, partId);
			_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras, function (obj) {
				return obj.extraNumber == extraId
			});
		}
		callback();
	}

	//- to delete bulk extras
	this.deleteMultipleExtras = function (level, bulkIds, subAssemblyId, partId, callback) {
		if (level == 'assembly') {
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.extras, function (obj) {
					return record == obj.extraNumber;
				});
			});
		} else if (level == 'subAssembly') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.subAssemblies[subAssIndex].extras, function (obj) {
					return record == obj.extraNumber;
				});
			});
		} else if (level == 'part') {
			subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			partIndex = this.getPartIndex(subAssIndex, partId);
			angular.forEach(bulkIds,  function (record) {
				_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras, function (obj) {
					return record == obj.extraNumber;
				});
			});
		}
		bulkArray = [];
		callback();
	}

});