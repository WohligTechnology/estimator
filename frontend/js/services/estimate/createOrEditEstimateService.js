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
			grossWeight: "",
			netWeight: ""
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
		quantity: "",
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
	};

	var customMaterial = {
		customMaterialName: "",
		uniqueId: "",
		density: "",
		rollingIndex: "",
		bendingIndex: "",
		fabrictionIndex: "",
		cuttingIndex: "",
		basePlate: {
			thickness: "",
			baseMetal: {}
		},
		hardFacingAlloys: [_.cloneDeep(hardFacingAlloy)],
		difficultyFactor: [],
		favourite: false,
		freeIssue: "",
		totalCostRsPerSm: "",
		totalCostRsPerKg: ""
	};

	var hardFacingAlloy = {
		thickness: "",
		alloy: {},
		costOfDepRsPerKg: "",
		costOfDepRsPerSm: ""
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
				callback(data.data);
			}
		});
		// }
	}
	//- to set a view of the page
	this.estimateView = function (estimateView, getLevelName, subAssemblyId, partId, callback) {
		getEstimateView = "views/content/estimate/estimateViews/" + estimateView + ".html";
		callback(getEstimateView);
	}
	//- to calculate total cost of addon/processing/extras
	this.totalCostCalculations = function (viewName, callback) {
		var costCalculations = {
			//- summation of processing cost at part, subAssembly
			pCost: 0,
			//- summation of addon cost at part, subAssembly
			aCost: 0,
			//- summation of addon weight at part, subAssembly
			aWeight: 0,
			//- summation of extra cost at part, subAssembly
			eCost: 0,
			//- separate summation (used in loop for processing) of processing cost at part
			pCostAtPart: 0,
			//- separate summation (used in loop for processing) of processing cost at subAssembly
			pCostAtSubAssembly: 0,
			//- separate summation (used in loop for processing) of processing cost at assembly level
			pCostAtAssemby: 0,
			//- separate summation (used in loop for processing) of addon cost at part
			aCostAtPart: 0,
			//- separate summation (used in loop for processing) of addon cost at subAssembly
			aCostAtSubAssembly: 0,
			//- separate summation (used in loop for processing) of addon cost at assembly level
			aCostAtAssemby: 0,
			//- separate summation (used in loop for processing) of extra cost at part
			eCostAtPart: 0,
			//- separate summation (used in loop for processing) of extra cost at subAssembly
			eCostAtSubAssembly: 0,
			//- separate summation (used in loop for processing) of extra cost at assembly level
			eCostAtAssemby: 0,
			//- weight of a part 
			wtAtPart: 0,
			//- summation of weight of all parts
			wtAtSubAssembly: 0,
			//- summation of weight of all subAssembly
			wtAtAssembly: 0,
			//- weight of a part 
			netWtAtPart: 0,
			//- summation of weight of all parts
			netWtAtSubAssembly: 0,
			//- summation of weight of all subAssembly
			netWtAtAssembly: 0,
			//- addon weight of a part 
			addonWtAtPart: 0,
			//- summation of addon weight of all parts
			addonWtAtSubAssembly: 0,
			//- summation of addon weight of all subAssembly
			addonWtAtAssembly: 0,
			//- materila cost of a part 
			mtPart: 0,
			//- summation of material cost of all parts
			mtAtSubAssembly: 0,
			//- summation of material cost of all subAssembly
			mtAtAssembly: 0
		}
		formData.assembly.totalCost = formData.assembly.materialCost = formData.assembly.processingCost = formData.assembly.addonCost = formData.assembly.extrasCost = 0;
		var thisRef = this;
		angular.forEach(formData.assembly.subAssemblies, function (subAssembly) {
			angular.forEach(subAssembly.subAssemblyParts, function (part) {
				//- get gross weight at part level
				if (!isNaN(parseFloat(part.keyValueCalculations.grossWeight))) {
					costCalculations.wtAtPart = parseFloat(part.keyValueCalculations.grossWeight);
				}
				//- get net weight at part level
				if (!isNaN(parseFloat(part.keyValueCalculations.netWeight))) {
					costCalculations.netWtAtPart = parseFloat(part.keyValueCalculations.netWeight);
				}
				//- get material cost at part level
				if (!isNaN(parseFloat(part.finalCalculation.materialPrice))) {
					costCalculations.mtPart = parseFloat(part.finalCalculation.materialPrice);
				}
				//- get summation of material cost of all parts 
				costCalculations.mtAtSubAssembly += costCalculations.mtPart * costCalculations.wtAtPart * part.quantity;
				//- processing cost at part level
				if (part.processing.length > 0) {
					costCalculations.pCostAtPart = thisRef.getProcessingTotalCost('part', part.processing);
				}
				//- addons cost at part level
				if (part.addons.length > 0) {
					var obj = thisRef.getAddonTotalCost('part', part.addons, subAssembly.subAssemblyNumber, part.partNumber);
					costCalculations.aCostAtPart = obj.totalCost;
					costCalculations.addonWtAtPart = obj.totalWeight;
				}
				//- extras cost at part level
				if (part.extras.length > 0) {
					costCalculations.eCostAtPart = thisRef.getExtraTotalCost(part.extras);
				}
				//- bind processing cost, addon cost & extra cost to part level variables
				part.processingCost = costCalculations.pCostAtPart;
				part.addonCost = costCalculations.aCostAtPart;
				part.addonWeight = costCalculations.addonWtAtPart;
				part.extrasCost = costCalculations.eCostAtPart;
				//- calculate summation of all processing available at part level
				if (part.processing.length != 0) {
					costCalculations.pCost += costCalculations.pCostAtPart;
				}
				//- calculate summation of all addons available at part level
				if (part.addons.length != 0) {
					costCalculations.aCost += costCalculations.aCostAtPart * part.quantity;
					costCalculations.aWeight += costCalculations.addonWtAtPart * part.quantity;
				}
				//- calculate summation of all extras available at part level
				if (part.extras.length != 0) {
					costCalculations.eCost += costCalculations.eCostAtPart;
				}
				//- get summation of (partWeight * quantity) of all parts 
				costCalculations.wtAtSubAssembly += costCalculations.wtAtPart * part.quantity;
				costCalculations.netWtAtSubAssembly += costCalculations.netWtAtPart * part.quantity;
				//- total cost at each part 
				part.totalCost = (costCalculations.mtPart * costCalculations.wtAtPart + part.processingCost + part.addonCost + part.extrasCost) * part.quantity;
				costCalculations.mtPart = costCalculations.addonWtAtPart = costCalculations.pCostAtPart = costCalculations.aCostAtPart = costCalculations.eCostAtPart = costCalculations.wtAtPart = 0;
			});
			//- bind weight of all parts of paricular subAssembly to variable 'totalWeight'
			subAssembly.totalWeight = costCalculations.wtAtSubAssembly;
			subAssembly.totalNetWeight = costCalculations.netWtAtSubAssembly;
			//- bind material cost of all parts of paricular subAssembly to variable 'material cost'
			subAssembly.materialCost = costCalculations.mtAtSubAssembly;
			costCalculations.mtAtAssembly += subAssembly.materialCost * subAssembly.quantity;
			//- processing cost at subAssembly level
			if (subAssembly.processing.length > 0) {
				costCalculations.pCostAtSubAssembly = thisRef.getProcessingTotalCost('subAssembly', subAssembly.processing, subAssembly.subAssemblyNumber);
			}
			//- addons cost at subAssembly level
			if (subAssembly.addons.length > 0) {
				var obj = thisRef.getAddonTotalCost('subAssembly', subAssembly.addons, subAssembly.subAssemblyNumber);
				costCalculations.aCostAtSubAssembly = obj.totalCost;
				costCalculations.addonWtAtSubAssembly = obj.totalWeight;
			}
			//- extras cost at subAssembly level
			if (subAssembly.extras.length > 0) {
				costCalculations.eCostAtSubAssembly = thisRef.getExtraTotalCost(subAssembly.extras);
			}
			costCalculations.pCost += costCalculations.pCostAtSubAssembly;
			costCalculations.aCost += costCalculations.aCostAtSubAssembly;
			costCalculations.aWeight += costCalculations.addonWtAtSubAssembly;
			costCalculations.eCost += costCalculations.eCostAtSubAssembly;
			subAssembly.processingCost = costCalculations.pCost;
			subAssembly.addonCost = costCalculations.aCost;
			subAssembly.addonWeight = costCalculations.aWeight;
			subAssembly.extrasCost = costCalculations.eCost;
			costCalculations.addonWtAtAssembly += costCalculations.aWeight * subAssembly.quantity;
			//- get summation of (SubAssemblyweight * addonWeight * quantity) of all subassemblies
			costCalculations.wtAtAssembly += (subAssembly.totalWeight + subAssembly.addonWeight) * subAssembly.quantity;
			costCalculations.netWtAtAssembly += (costCalculations.netWtAtSubAssembly + subAssembly.addonWeight) * subAssembly.quantity;
			//- total cost at each part 
			subAssembly.totalCost = (subAssembly.materialCost + subAssembly.processingCost + subAssembly.addonCost + subAssembly.extrasCost) * subAssembly.quantity;
			costCalculations.pCostAtAssemby += costCalculations.pCost * subAssembly.quantity;
			costCalculations.aCostAtAssemby += costCalculations.aCost * subAssembly.quantity;
			costCalculations.eCostAtAssemby += costCalculations.eCost * subAssembly.quantity;
			costCalculations.pCostAtSubAssembly = costCalculations.aCostAtSubAssembly = costCalculations.eCostAtSubAssembly = 0;
			costCalculations.pCost = costCalculations.aCost = costCalculations.eCost = costCalculations.aWeight = 0;
			costCalculations.mtAtSubAssembly = costCalculations.wtAtSubAssembly = costCalculations.netWtAtSubAssembly = costCalculations.addonWtAtSubAssembly = 0;
		});
		if (viewName == 'assembly') {
			//- processing cost at assembly level
			if (angular.isDefined(formData.assembly.processing)) {
				costCalculations.pCost = thisRef.getProcessingTotalCost('assembly', formData.assembly.processing);
			}
			//- addons cost at assembly level
			if (angular.isDefined(formData.assembly.addons)) {
				var obj = thisRef.getAddonTotalCost('assembly', formData.assembly.addons);
				costCalculations.aCost = obj.totalCost;
				costCalculations.aWeight += obj.totalWeight;
			}
			//- extras cost at assembly level
			if (angular.isDefined(formData.assembly.extras)) {
				costCalculations.eCostAtSubAssembly = thisRef.getExtraTotalCost(formData.assembly.extras);
			}
			formData.assembly.addonWeight = costCalculations.addonWtAtAssembly + costCalculations.aWeight;
			formData.assembly.totalWeight = formData.assembly.wtAtAssembly = costCalculations.wtAtAssembly + costCalculations.aWeight;
			formData.assembly.netWtAtAssembly = costCalculations.netWtAtAssembly + costCalculations.aWeight;
			formData.assembly.materialCost = formData.assembly.mtAtAssembly = costCalculations.mtAtAssembly;
			formData.assembly.processingCost = formData.assembly.pCostAtAssemby = costCalculations.pCostAtAssemby + costCalculations.pCost;
			formData.assembly.addonCost = formData.assembly.aCostAtAssemby = costCalculations.aCostAtAssemby + costCalculations.aCost;
			formData.assembly.extrasCost = formData.assembly.eCostAtAssemby = costCalculations.eCostAtAssemby + costCalculations.eCost;
			formData.assembly.costPrice = (formData.assembly.mtAtAssembly + formData.assembly.pCostAtAssemby + formData.assembly.aCostAtAssemby + formData.assembly.eCostAtAssemby);
			//formData.assembly.totalCost += costCalculations.mtAtAssembly * costCalculations.wtAtAssembly + costCalculations.pCost + costCalculations.aCost + costCalculations.eCost;
			if (!isNaN(formData.assembly.costPrice)) {
				this.addMarginsToCost();
			}
		}
		callback();
	}
	//- to calculate selling cost 
	this.addMarginsToCost = function () {
		var sellingObj = {
			markups: [],
			negotiation: 10,
			commission: 10,
			other: 10,
			temp: {},
		};
		//- get all variable markups & update total cost
		NavigationService.boxCall('MVariableMarkup/getMMarkupData', function (data) {
			sellingObj.markups = data.data;
			angular.forEach(sellingObj.markups, function (markup) {
				if (_.isNaN(parseFloat(markup.overhead))) {
					markup.overhead = 10;
				}
				if (_.isNaN(parseFloat(markup.minProfit))) {
					markup.minProfit = 10;
				}
				if (markup.markupType == "material") {
					formData.assembly.materialCost += (formData.assembly.mtAtAssembly * ((markup.overhead + markup.minProfit) / 100));
				} else if (markup.markupType == "process") {
					formData.assembly.processingCost += (formData.assembly.pCostAtAssemby * ((markup.overhead + markup.minProfit) / 100));
				} else if (markup.markupType == "addon") {
					formData.assembly.addonCost += (formData.assembly.aCostAtAssemby * ((markup.overhead + markup.minProfit) / 100));
				} else {
					formData.assembly.extrasCost += (formData.assembly.eCostAtAssemby * ((markup.overhead + markup.minProfit) / 100));
				}
			});
			formData.assembly.totalCost = (formData.assembly.materialCost + formData.assembly.processingCost + formData.assembly.addonCost + formData.assembly.extrasCost);
			sellingObj.markups = [];
			//- only 1st time allow it
			if (angular.isUndefined(formData.assembly.negotiation) || angular.isUndefined(formData.assembly.commission) || angular.isUndefined(formData.assembly.other)) {
				//- get all fixed markups & update total cost
				NavigationService.boxCall('MFixedMarkup/search', function (data) {
					if (data.value) {
						sellingObj.markups = data.data.results;
						sellingObj.markups = sellingObj.markups[sellingObj.markups.length - 1]

						if (angular.isDefined(sellingObj.markups.fixedMarkups)) {
							if (!_.isNaN(parseFloat(sellingObj.markups.fixedMarkups.negotiation))) {
								sellingObj.negotiation = sellingObj.markups.fixedMarkups.negotiation;
							}
							if (!_.isNaN(parseFloat(sellingObj.markups.fixedMarkups.commission))) {
								sellingObj.commission = sellingObj.markups.fixedMarkups.commission;
							}
							if (!_.isNaN(parseFloat(sellingObj.markups.fixedMarkups.other))) {
								sellingObj.other = sellingObj.markups.fixedMarkups.other;
							}
						}
						if (angular.isDefined(formData.assembly.enquiryId)) {
							sellingObj.temp = formData.assembly.enquiryId.customerId.margins;
							if (angular.isDefined(sellingObj.temp.negotiation)) {
								sellingObj.negotiation = parseFloat(sellingObj.temp.negotiation);
							}
							if (angular.isDefined(sellingObj.temp.commission)) {
								sellingObj.commission = parseFloat(sellingObj.temp.commission);
							}
							if (angular.isDefined(sellingObj.temp.other)) {
								sellingObj.other = parseFloat(sellingObj.temp.other);
							}
						}
						formData.assembly.negotiation = sellingObj.negotiation;
						formData.assembly.commission = sellingObj.commission;
						formData.assembly.other = sellingObj.other;
						formData.assembly.totalCost += (formData.assembly.totalCost * ((formData.assembly.negotiation + formData.assembly.commission + formData.assembly.other) / 100));
					}
				});
			} else {
				formData.assembly.totalCost += (formData.assembly.totalCost * ((formData.assembly.negotiation + formData.assembly.commission + formData.assembly.other) / 100));
			}
		});
	}
	//-to update totalCost on the basis of negotiation, commission & other 
	this.addCNOToCost = function () {
		formData.assembly.totalCost = (parseFloat(formData.assembly.materialCost) + parseFloat(formData.assembly.processingCost) + parseFloat(formData.assembly.addonCost) + parseFloat(formData.assembly.extrasCost));
		formData.assembly.totalCost += (formData.assembly.totalCost * ((parseFloat(formData.assembly.negotiation) + parseFloat(formData.assembly.commission) + parseFloat(formData.assembly.other)) / 100));
	}
	this.addScalingFactorToCost = function (type) {
		NavigationService.boxCall('MFixedMarkup/search', function (data) {
			formData.assembly.totalCost = (parseFloat(formData.assembly.materialCost) + parseFloat(formData.assembly.processingCost) + parseFloat(formData.assembly.addonCost) + parseFloat(formData.assembly.extrasCost));
			//formData.assembly.totalCost += (formData.assembly.totalCost * (parseFloat(formData.assembly.scaleFactor) / 100));
		});

	}
	//- to get processing totalCost
	this.getProcessingTotalCost = function (level, processings, subAssId) {
		var thisRef = this;
		var totalCost = 0;
		var keyValues;
		angular.forEach(processings, function (processing) {
			//- 2nd toggle button at MProcess  is on
			if (processing.processType.showQuantityFields) {
				//- to get keyValue calculations
				if (level == 'subAssembly' || level == 'assembly') {
					if (level == 'subAssembly') {
						//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding subAssembly		
						var subAssIndex = thisRef.getSubAssemblyIndex(subAssId);
						thisRef.KeyValueCalculations(level, formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (data) {
							keyValues = data;
						});
					} else if (level == 'assembly') {
						//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding assembly
						thisRef.KeyValueCalculations(level, formData.assembly.subAssemblies, function (data) {
							keyValues = data;
						});
					}
					if (processing.quantity.linkedKeyValue.keyVariable == "Perimeter") {
						processing.quantity.linkedKeyValue.keyValue = parseFloat(keyValues.perimeter) * parseFloat(processing.processType.quantity.mulfact);
					} else if (processing.quantity.linkedKeyValue.keyVariable == "SMA") {
						processing.quantity.linkedKeyValue.keyValue = parseFloat(keyValues.sheetMetalArea) * parseFloat(processing.processType.quantity.mulfact);
					} else if (processing.quantity.linkedKeyValue.keyVariable == "SA") {
						processing.quantity.linkedKeyValue.keyValue = parseFloat(keyValues.surfaceArea) * parseFloat(processing.processType.quantity.mulfact);
					} else if (processing.quantity.linkedKeyValue.keyVariable == "Gwt") {
						processing.quantity.linkedKeyValue.keyValue = parseFloat(keyValues.grossWeight) * parseFloat(processing.processType.quantity.mulfact);
					} else if (processing.quantity.linkedKeyValue.keyVariable == "Nwt") {
						processing.quantity.linkedKeyValue.keyValue = parseFloat(keyValues.netWeight) * parseFloat(processing.processType.quantity.mulfact);
					}
					if (processing.quantity.contengncyOrWastage != 0) {
						processing.totalCost = (parseFloat(processing.quantity.totalQuantity) * parseFloat(processing.rate) * parseFloat(processing.quantity.linkedKeyValue.keyValue)) * ((parseFloat(processing.quantity.utilization)) / 100) * ((100 + parseFloat(processing.quantity.contengncyOrWastage)) / 100);
					} else {
						processing.totalCost = (parseFloat(processing.quantity.totalQuantity) * parseFloat(processing.rate) * parseFloat(processing.quantity.linkedKeyValue.keyValue)) * ((parseFloat(processing.quantity.utilization)) / 100);
					}
				}
			}
			totalCost += processing.totalCost;
		});
		return totalCost;
	}
	//- to get addons totalCost
	this.getAddonTotalCost = function (level, addons, subAssId, partId) {
		var obj = {
			totalCost: 0,
			totalWeight: 0
		}
		var thisRef = this;
		var keyValues;
		angular.forEach(addons, function (addon) {
			//- 2nd toggle button at MProcess  is on
			if (addon.showQuantityFields) {
				if (level == 'subAssembly' || level == 'assembly') {
					if (level == 'subAssembly') {
						//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding subAssembly		
						var subAssIndex = thisRef.getSubAssemblyIndex(subAssId);
						thisRef.KeyValueCalculations(level, formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (data) {
							keyValues = data;
						});
					} else if (level == 'assembly') {
						//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding assembly
						thisRef.KeyValueCalculations(level, formData.assembly.subAssemblies, function (data) {
							keyValues = data;
						});
					}
				} else {
					var subAssIndex = thisRef.getSubAssemblyIndex(subAssId);
					var partIndex = thisRef.getPartIndex(subAssIndex, partId);
					keyValues = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].keyValueCalculations;
				}
				if (addon.quantity.keyValue.keyVariable == "Perimeter") {
					addon.quantity.keyValue.keyValue = parseFloat(keyValues.perimeter) * parseFloat(addon.addonType.quantity.mulFact);
				} else if (addon.quantity.keyValue.keyVariable == "SMA") {
					addon.quantity.keyValue.keyValue = parseFloat(keyValues.sheetMetalArea) * parseFloat(addon.addonType.quantity.mulFact);
				} else if (addon.quantity.keyValue.keyVariable == "SA") {
					addon.quantity.keyValue.keyValue = parseFloat(keyValues.surfaceArea) * parseFloat(addon.addonType.quantity.mulFact);
				} else if (processing.quantity.keyValue.keyVariable == "Gwt") {
					addon.quantity.keyValue.keyValue = parseFloat(keyValues.grossWeight) * parseFloat(addon.addonType.quantity.mulFact);
				} else if (processing.quantity.keyValue.keyVariable == "Nwt") {
					addon.quantity.keyValue.keyValue = parseFloat(keyValues.netWeight) * parseFloat(addon.addonType.quantity.mulFact);
				}
				var rate = parseFloat(addon.rate);
				var quantity = parseFloat(addon.quantity.total);
				//- weight per unit
				var weightPerUnit = parseFloat(addon.weightPerUnit);
				if (addon.showQuantityFields) {
				  //- case 1 & case 2
				  var keyValue = parseFloat(addon.quantity.keyValue.keyValue);
				  var supportingVariable = parseFloat(addon.quantity.supportingVariable.value);
				  var utilization = parseFloat(addon.quantity.utilization);
				  var contengncyOrWastage = parseFloat(addon.quantity.contengncyOrWastage);
				  var mulFact = parseFloat(addon.addonType.quantity.mulFact);
				  addon.totalWeight = weightPerUnit * mulFact * keyValue * supportingVariable * (utilization / 100);
				  addon.totalCost = quantity * rate * keyValue * supportingVariable * (utilization / 100);
				  if (parseFloat(contengncyOrWastage) > 0) {
					addon.totalWeight = addon.totalWeight * (1 + (contengncyOrWastage / 100));
					addon.totalCost = addon.totalCost * (1 + (contengncyOrWastage / 100));
				  }
				} else {
				  //- case 3 & case 4
				  addon.totalWeight = quantity * weightPerUnit;
				  addon.totalCost = quantity * rate;
				}
			}
			obj.totalCost += addon.totalCost;
			if (!isNaN(parseFloat(addon.totalWeight))) {
				obj.totalWeight += parseFloat(addon.totalWeight);
			}
		});
		return obj;
	}
	//- to get extras totalCost
	this.getExtraTotalCost = function (extras) {
		var totalCost = 0;
		angular.forEach(extras, function (extra) {
			totalCost += extra.totalCost;
		});
		return totalCost;
	}
	//- to get a view of the page
	this.estimateViewData = function (estimateView, getLevelName, subAssemblyId, partId, callback) {
		var getViewData = [];

		if (estimateView == 'assembly') {
			//formData.assembly.quantity = 1;
			getViewData = formData.assembly;
		} else if (estimateView == 'subAssembly') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			getViewData = formData.assembly.subAssemblies[subAssIndex];
		} else if (estimateView == 'partDetail') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);

			var estimatePartObj = {

				selectedShortcut: {}, //- selected partType presets 
				selectedPartType: {}, //- selected partType
				selectedMaterial: {}, //- selected material     
				selectedSize: {}, //- slected size
				selectedShape: {}, //- selected shape

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
					grossWeight: "", //- part.keyValueCalculation.grossWeight
					netWeight: "" //- part.keyValueCalculation.netWeight
				},
				finalCalculation: {
					materialPrice: null, //- part.finalCalculation.materialPrice
					itemUnitPrice: null, //- part.finalCalculation.itemUnitPrice
					totalCostForQuantity: null //- part.finalCalculation.totalCostForQuantity
				},
				subAssNumber: subAssemblyId,
				partNumber: partId
			};

			estimatePartObj.processingCount = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing.length;
			estimatePartObj.addonCount = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons.length;
			estimatePartObj.extraCount = formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras.length;
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
				if (!_.isEmpty(tempPart.shape) && tempPart.shape != undefined) {
					estimatePartObj.selectedShape = tempPart.shape; //- selected material
				}
				if (!_.isEmpty(tempPart.customMaterial) && tempPart.customMaterial != undefined) {
					estimatePartObj.selectedCustomMaterial = tempPart.customMaterial; //- selectedCustomeMaterial
				}
				estimatePartObj.formFactor = tempPart.formFactor; //- formFactor
				estimatePartObj.length = tempPart.length; //- length
				estimatePartObj.sizeFactor = tempPart.sizeFactor; //- sizeFactor
				estimatePartObj.thickness = tempPart.thickness; //- thickness
				estimatePartObj.wastage = tempPart.wastage; //- wastage

				estimatePartObj.quantity = tempPart.quantity; //- quantity
				estimatePartObj.variable = tempPart.variable; //- variable

				estimatePartObj.finalCalculation.materialPrice = tempPart.finalCalculation.materialPrice;
				estimatePartObj.finalCalculation.itemUnitPrice = tempPart.finalCalculation.itemUnitPrice;
				estimatePartObj.finalCalculation.totalCostForQuantity = tempPart.finalCalculation.totalCostForQuantity

				estimatePartObj.keyValueCalculations.perimeter = tempPart.keyValueCalculations.perimeter;
				estimatePartObj.keyValueCalculations.sheetMetalArea = tempPart.keyValueCalculations.sheetMetalArea;
				estimatePartObj.keyValueCalculations.surfaceArea = tempPart.keyValueCalculations.surfaceArea;
				estimatePartObj.keyValueCalculations.grossWeight = tempPart.keyValueCalculations.grossWeight;
				estimatePartObj.keyValueCalculations.netWeight = tempPart.keyValueCalculations.netWeight;
				estimatePartObj.partUpdateStatus = true;

			}
			callback(estimatePartObj);

		} else if (estimateView == 'editPartItemDetail') {
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
			var partIndex = this.getPartIndex(subAssIndex, partId);

			var estimatePartObj = {
				allShortcuts: [], //- get all presets name from API
				allPartTypes: [], //- get all part type from API
				allShapes: [], //- get all shape data from API

				selectedShortcut: {}, //- selected partType presets 
				selectedPartType: {}, //- selected partType
				selectedMaterial: {}, //- selected material     
				selectedSize: {}, //- slected size
				selectedShape: {}, //- selected shape

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
					grossWeight: "", //- part.keyValueCalculation.grossWeight
					netWeight: "" //- part.keyValueCalculation.netWeight
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

					NavigationService.apiCall('CustomMaterial/getAllCustomMaterial', {
						estimateId: formData.assembly._id
					}, function (allCustomMaterials) {
						if (allCustomMaterials.data != "noDataFound") {
							estimatePartObj.customMaterials = allCustomMaterials.data;
						} else {
							estimatePartObj.customMaterials = [];
						}
						NavigationService.boxCall('MShape/getMShapeData', function (shapeData) {
							estimatePartObj.allShapes = shapeData.data;
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
								if (!_.isEmpty(tempPart.shape) && tempPart.shape != undefined) {

									estimatePartObj.selectedShape = tempPart.shape; //- selected material
								}
								if (!_.isEmpty(tempPart.customMaterial) && tempPart.customMaterial != undefined) {
									estimatePartObj.selectedCustomMaterial = tempPart.customMaterial; //- selectedCustomeMaterial
								}

								estimatePartObj.quantity = tempPart.quantity; //- quantity
								estimatePartObj.variable = tempPart.variable; //- variable

								estimatePartObj.formFactor = tempPart.formFactor; //- formFactor
								estimatePartObj.length = tempPart.length; //- length
								estimatePartObj.sizeFactor = tempPart.sizeFactor; //- sizeFactor
								estimatePartObj.thickness = tempPart.thickness; //- thickness
								estimatePartObj.wastage = tempPart.wastage; //- wastage

								estimatePartObj.finalCalculation.materialPrice = tempPart.finalCalculation.materialPrice;
								estimatePartObj.finalCalculation.itemUnitPrice = tempPart.finalCalculation.itemUnitPrice;
								estimatePartObj.finalCalculation.totalCostForQuantity = tempPart.finalCalculation.totalCostForQuantity

								estimatePartObj.keyValueCalculations.perimeter = tempPart.keyValueCalculations.perimeter;
								estimatePartObj.keyValueCalculations.sheetMetalArea = tempPart.keyValueCalculations.sheetMetalArea;
								estimatePartObj.keyValueCalculations.surfaceArea = tempPart.keyValueCalculations.surfaceArea;
								estimatePartObj.keyValueCalculations.grossWeight = tempPart.keyValueCalculations.grossWeight;
								estimatePartObj.keyValueCalculations.netWeight = tempPart.keyValueCalculations.netWeight;
								estimatePartObj.partUpdateStatus = true;

							}
							callback(estimatePartObj);

						});
					});
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
		if (estimateView != 'editPartItemDetail' && estimateView != 'partDetail') {
			if (estimateView == 'processing' || estimateView == 'addons' || estimateView == 'extras') {
				getViewData.totalCost = 0;
				_.forEach(getViewData, function (record) {
					getViewData.totalCost += record.totalCost;
				});
			}
			callback(getViewData);
		}

	}
	//- to save current estimate object
	this.saveCurrentEstimate = function (callback) {
		NavigationService.apiCall('DraftEstimate/save', formData.assembly, function (data) {
			// $.jStorage.deleteKey("estimateObject");
			callback(data.data);
		});
	}
	//- to compile current estimate object
	this.compileCurrentEstimate = function (callback) {
		var temp = true;
		_.forEach(formData.assembly.subAssemblies, function (subAssembly) {
			_.forEach(subAssembly.subAssemblyParts, function (part) {
				if (temp) {
					if (!part.partValidationStatus) {
						temp = false;
						var tempObj = {
							status: false,
							partName: part.partName
						}
						callback(tempObj);
					}
				}
			});
		});
		if (temp) {
			var tempObj = {
				_id: formData.assembly._id,
				assemblyNumber: formData.assembly.assemblyNumber
			}
			NavigationService.apiCall('DraftEstimate/compileEstimate', tempObj, function (data) {
				callback(data.data);
			});
		}
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


	// //- to get all assembly numbers
	// this.getAllAssemblyNumbers = function (callback) {
	// 	NavigationService.boxCall('Estimate/getAllAssembliesNo', function (data) {
	// 		callback(data.data);
	// 	});
	// }

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
	//- to get all subAssembly numbers of all assemblies
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
	//- to get all subAssembly numbers of current assemblies
	this.getAllSubAssData = function (subAssNumber, callback) {
		var subAssNumbersArray = [];
		angular.forEach(formData.assembly.subAssemblies,  function (record) {
			subAssNumbersArray.push(record.subAssemblyNumber);
		});
		_.remove(subAssNumbersArray, function (n) {
			return n == subAssNumber;
		});
		callback(subAssNumbersArray);
	}
	//- to add a subAssembly
	this.createSubAssembly = function (subAssObj, callback) {
		var id = this.getSubAssemblyNumber();
		var tempSubAssObj = _.cloneDeep(subAssembly);
		tempSubAssObj.subAssemblyNumber = formData.assembly.assemblyNumber + "SA" + id;
		tempSubAssObj.subAssemblyName = subAssObj.subAssemblyName;
		if (angular.isDefined(subAssObj.quantity)) {
			tempSubAssObj.quantity = subAssObj.quantity;
		} else {
			tempSubAssObj.quantity = 1;
		}
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
	//- to get sizes of selected part type
	this.getSelectedPartTypeData = function (partTypeId, callback) {
		var partTypeObj = {
			partType: partTypeId
		}
		NavigationService.apiCall('MPartPresets/getPresetSizes', partTypeObj, function (data) {
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
		formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.push(tempPartObj);
		callback();
	}
	//- update Part Detail with all calculation & other data
	this.updatePartDetail = function (partObject, callback) {
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
			if (angular.isDefined(partObject.selectedSize._id)) {
				tempPart.size = partObject.selectedSize.size;
			} else {
				tempPart.size = partObject.selectedSize; //- size
			}
		}
		if (!_.isEmpty(partObject.selectedCustomMaterial) && partObject.selectedCustomMaterial != undefined) {
			tempPart.customMaterial = partObject.selectedCustomMaterial; //- selectedCustomeMaterial
		}
		if (!_.isEmpty(partObject.selectedShape) && partObject.selectedShape != undefined) {
			tempPart.shape = partObject.selectedShape; //- selectedCustomeMaterial
		}

		tempPart.quantity = partObject.quantity; //- quantity
		tempPart.formFactor = partObject.formFactor; //- formFactor
		tempPart.length = partObject.length; //- length
		tempPart.sizeFactor = partObject.sizeFactor; //- sizeFactor
		tempPart.thickness = partObject.thickness; //- thickness
		tempPart.wastage = partObject.wastage; //- wastage
		tempPart.variable = partObject.variables; //- variables 
		tempPart.finalCalculation = {};
		tempPart.finalCalculation.materialPrice = partObject.finalCalculation.materialPrice;
		tempPart.finalCalculation.itemUnitPrice = partObject.finalCalculation.itemUnitPrice;
		tempPart.finalCalculation.totalCostForQuantity = partObject.finalCalculation.totalCostForQuantity
		tempPart.keyValueCalculations = {};
		tempPart.keyValueCalculations.perimeter = partObject.keyValueCalculations.perimeter;
		tempPart.keyValueCalculations.sheetMetalArea = partObject.keyValueCalculations.sheetMetalArea;
		tempPart.keyValueCalculations.surfaceArea = partObject.keyValueCalculations.surfaceArea;
		tempPart.keyValueCalculations.grossWeight = partObject.keyValueCalculations.grossWeight;
		tempPart.keyValueCalculations.netWeight = partObject.keyValueCalculations.netWeight;
		tempPart.partUpdateStatus = true;
		//- to check whether user filled all part level data
		if (!isNaN(tempPart.finalCalculation.totalCostForQuantity)) {
			tempPart.partValidationStatus = true;
		} else {
			tempPart.partValidationStatus = false;
		}

		formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex] = tempPart;
		callback(formData.assembly);
	}
	//- keyValue calculation
	this.KeyValueCalculations = function (level, records, callback) {
		var count = records.length;
		var tempObj = {
			perimeter: 0,
			sheetMetalArea: 0,
			surfaceArea: 0,
			grossWeight: 0,
			netWeight: 0
		};
		//- to check access permission
		var temp = true;
		if (level == 'subAssembly') {
			_.forEach(records,  function (part) {
				if (temp) {
					if (!isNaN(parseFloat(part.keyValueCalculations.perimeter))) {
						tempObj.perimeter += parseFloat(part.keyValueCalculations.perimeter);
					} else {
						//- if perimeter is not present break the loop
						temp = false;
						return false;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.sheetMetalArea))) {
						tempObj.sheetMetalArea += parseFloat(part.keyValueCalculations.sheetMetalArea);
					} else {
						temp = false;
						return false;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.surfaceArea))) {
						tempObj.surfaceArea += parseFloat(part.keyValueCalculations.surfaceArea);
					} else {
						temp = false;
						return false;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.grossWeight))) {
						tempObj.grossWeight += parseFloat(part.keyValueCalculations.grossWeight);
					} else {
						temp = false;
						return false;
					}
					if (!isNaN(parseFloat(part.keyValueCalculations.netWeight))) {
						tempObj.netWeight += parseFloat(part.keyValueCalculations.netWeight);
					} else {
						temp = false;
					}
				}
			});
		} else {
			_.forEach(records,  function (subAssembly) {
				_.forEach(subAssembly.subAssemblyParts,  function (part) {
					if (temp) {
						if (!isNaN(parseFloat(part.keyValueCalculations.perimeter))) {
							tempObj.perimeter += parseFloat(part.keyValueCalculations.perimeter);
						} else {
							temp = false;
							return false;
						}
						if (!isNaN(parseFloat(part.keyValueCalculations.sheetMetalArea))) {
							tempObj.sheetMetalArea += parseFloat(part.keyValueCalculations.sheetMetalArea);
						} else {
							temp = false;
							return false;
						}
						if (!isNaN(parseFloat(part.keyValueCalculations.surfaceArea))) {
							tempObj.surfaceArea += parseFloat(part.keyValueCalculations.surfaceArea);
						} else {
							temp = false;
							return false;
						}
						if (!isNaN(parseFloat(part.keyValueCalculations.grossWeight))) {
							tempObj.grossWeight += parseFloat(part.keyValueCalculations.grossWeight);
						} else {
							temp = false;
							return false;
						}
						if (!isNaN(parseFloat(part.keyValueCalculations.netWeight))) {
							tempObj.netWeight += parseFloat(part.keyValueCalculations.netWeight);
						} else {
							temp = false;
						}
					}
				});
			});
		}
		if (temp && records.length != 0) {
			callback(tempObj);
		} else {
			callback();
		}
	}
	//- get all materials in case if user selects a shape first
	this.getAllMaterials = function (callback) {
		NavigationService.boxCall('MMaterial/getAllMaterials', function (data) {
			callback(data.data);
		});
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
				grossWeight: null,
				netWeight: null
			},

			linkedKeyValuesAtPartCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				grossWeight: null,
				netWeight: null
			},
			linkedKeyValuesAtSubAssemblyCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				grossWeight: null,
				netWeight: null
			},
			linkedKeyValuesAtAssemblyCalculation: {
				perimeter: null,
				sheetMetalArea: null,
				surfaceArea: null,
				grossWeight: null,
				netWeight: null
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

					partProcessingObj.finalUom = tempProcessingObj.processType.quantity.finalUom.uomName;
					partProcessingObj.remark = tempProcessingObj.remark;
					partProcessingObj.totalCost = tempProcessingObj.totalCost;
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
				grossWeight: null,
				netWeight: null,
				Nos: null,
				Hrs: null
			},
			linkedKeyValuesAtSubAssemblyCalculation: {
				perimeter: null,
				SMA: null,
				SA: null,
				grossWeight: null,
				netWeight: null,
				Nos: null,
				Hrs: null
			},
			linkedKeyValuesAtAssemblyCalculation: {
				perimeter: null,
				SMA: null,
				SA: null,
				grossWeight: null,
				netWeight: null,
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
				grossWeight: tempPartCal.grossWeight,
				netWeight: tempPartCal.netWeight,
				Nos: null,
				Hrs: null
			};
		} else if (level == 'subAssembly') {
			//- get linkedKeyValue object by calculating the average of all parts belongs to the corresponding subAssembly
			var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);

			this.KeyValueCalculations(level, formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (data) {
				if (!_.isEmpty(data)) {
					addonObject.linkedKeyValuesAtSubAssemblyCalculation = {
						perimeter: data.perimeter,
						SMA: data.sheetMetalArea,
						SA: data.surfaceArea,
						grossWeight: data.grossWeight,
						netWeight: data.netWeight,
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
						grossWeight: data.grossWeight,
						netWeight: data.netWeight,
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


					addonObject.showQuantityFields = tempAddonObj.showQuantityFields;
					addonObject.showRateFields = tempAddonObj.showRateFields;

					addonObject.rate.value = tempAddonObj.rate;
					addonObject.rate.uom = tempAddonObj.addonType.rate.uom.uomName;

					if (addonObject.showQuantityFields) {
						addonObject.quantity.supportingVariable.supportingVariable = tempAddonObj.quantity.supportingVariable.supportingVariable;
						addonObject.quantity.supportingVariable.value = tempAddonObj.quantity.supportingVariable.value;
						addonObject.quantity.supportingVariable.uom = tempAddonObj.addonType.quantity.additionalInputUom.uomName;
						addonObject.quantity.keyValue.keyVariable = tempAddonObj.quantity.keyValue.keyVariable;
						addonObject.quantity.utilization = tempAddonObj.quantity.utilization;
						addonObject.quantity.contengncyOrWastage = tempAddonObj.quantity.contengncyOrWastage;
						addonObject.quantity.keyValue.keyValue = tempAddonObj.quantity.keyValue.keyValue;
					}
					if (addonObject.showRateFields) {
						addonObject.selectedMaterial = tempAddonObj.addonItem;
					}
					addonObject.quantity.keyValue.uom = tempAddonObj.addonType.quantity.linkedKeyUom.uomName;

					addonObject.weightPerUnit = tempAddonObj.weightPerUnit;
					addonObject.totalWeight = tempAddonObj.totalWeight;
					addonObject.quantity.total = tempAddonObj.quantity.total;
					addonObject.totalCost = tempAddonObj.totalCost;
					addonObject.remarks = tempAddonObj.remarks;

					addonObject.addonNumber = tempAddonObj.addonNumber;

					callback(addonObject);
				});
			}
		});
	}
	//- called when user will select a processType while adding a processing at any level
	this.getSelectedAddonType = function (addonTypeId, callback) {

		NavigationService.apiCall('MAddonType/getAddonMaterial', {
			_id: addonTypeId
		}, function (data) {
			callback(data.data.materials);
		});
	}

	this.getAddonTypeData = function (callback) {}

	//- to add an addon
	this.createAddon = function (addonObj, level, subAssemblyId, partId, callback) {
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
		tempAddonObject.showRateFields = addonData.showRateFields;
		tempAddonObject.showQuantityFields = addonData.showQuantityFields;

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
			} else if (type == 'customMaterial') {
				this.getAllMaterialData(function (data) {
					var allCustomMaterials = data;
					angular.forEach(allCustomMaterials,  function (obj) {
						bulkArray.push(obj._id);
					})
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
			uom: "",
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
			} else {
				extraObj.allExtraItem = data.data;
				extraObj.selecetdExtraItem = tempExtraObj.extraItem;
				extraObj.uom = tempExtraObj.uom;
				extraObj.extraNumber = tempExtraObj.extraNumber;
				extraObj.totalCost = tempExtraObj.totalCost;
				extraObj.remark = tempExtraObj.remark;
				extraObj.quantity = tempExtraObj.quantity;
				extraObj.rate = tempExtraObj.rate;
				extraObj.uom = tempExtraObj.uom;
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
		tempExtraObj.extraItem = extraObj.selectedExtraItem;
		tempExtraObj.extraNumber = extraObj.extraNumber;
		tempExtraObj.totalCost = extraObj.totalCost;
		tempExtraObj.remark = extraObj.remark;
		tempExtraObj.quantity = extraObj.quantity;
		tempExtraObj.rate = extraObj.rate;
		tempExtraObj.uom = extraObj.uom;

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
			extraObj.extraItem = extraObj.extraItem;
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

	//**********************************Custom Material***********************************************//

	this.getAllMaterialData = function (callback) {
		var temp = [];
		var tempObj = {
			estimateId: formData.assembly._id
		};
		NavigationService.apiCall('CustomMaterial/getAllCustomMaterial', tempObj, function (data) {
			if (data.data == "noDataFound") {
				temp = [];
			} else {
				temp = data.data;
				temp.costOfDepRsPerKg = 0;
				temp.costOfDepRsPerSm = 0;
				_.forEach(temp, function (record) {
					temp.costOfDepRsPerKg += record.totalCostRsPerKg;
					temp.costOfDepRsPerSm += record.totalCostRsPerSm;
				});
			}
			callback(temp);
		});
	}
	//- to get custom material data
	this.getCustomMaterialModalData = function (operation, customMaterialData, callback) {
		var customMaterialObj = {
			allBaseMetals: [],
			allAlloys: [],
			allDifficultyFactors: []
		};
		var allMaterials;
		if (angular.isDefined(customMaterialData)) {
			customMaterialObj.custMaterialObj = customMaterialData;
		} else {
			customMaterial.estimateId = formData.assembly._id;
			customMaterial.hardFacingAlloys = [_.cloneDeep(hardFacingAlloy)];
			customMaterialObj.custMaterialObj = _.cloneDeep(customMaterial);
		}
		if (operation == "save") {
			customMaterialObj.saveBtn = true;
			customMaterialObj.editBtn = false;
		} else if (operation == "update") {
			customMaterialObj.saveBtn = false;
			customMaterialObj.editBtn = true;
		}
		NavigationService.boxCall('MMaterial/getAllMaterials', function (data) {
			allMaterials = data.data;
			angular.forEach(allMaterials,  function (record) {
				if (record.type == 'customBase') {
					customMaterialObj.allBaseMetals.push(record);
				} else if (record.type == 'customOverlay') {
					customMaterialObj.allAlloys.push(record);
				}
			});
			NavigationService.boxCall('MDifficultyFactor/getMDifficultyFactorData', function (data) {
				customMaterialObj.allDifficultyFactors = data.data;
				callback(customMaterialObj)
			});
		});
	}
	//- to save custome material object
	this.createCustomMaterial = function (customMaterialObj, callback) {
		NavigationService.apiCall('CustomMaterial/createCustomMat', customMaterialObj, function (data) {
			callback(data);
		});
	}
	//- to delete custom material
	this.deleteCustomMaterial = function (customMaterialId, customMaterialIds, callback) {
		var idsArray = [];
		if (angular.isDefined(customMaterialIds)) {
			angular.forEach(customMaterialIds,  function (record) {
				idsArray.push(record);
			});
		} else {
			idsArray.push(customMaterialId);
		}
		NavigationService.delete('Web/delRestrictions/CustomMaterial', {
			idsArray: idsArray
		}, function (data) {
			callback(data);
		});
	}
	//- to get all favourite custom material 
	this.getImportCustomMaterialData = function (callback) {
		NavigationService.boxCall('CustomMaterial/getAllFavouriteCm', function (data) {
			callback(data);
		});
	}
	//- to import custom material 
	this.importCustomMaterial = function (customMaterialData, callback) {
		var tempArray = [];
		_.forEach(customMaterialData, function (customMaterialObj) {
			customMaterialObj = _.omit(customMaterialObj, ['_id', 'customMaterialId']);
			customMaterialObj.estimateId = formData.assembly._id;
			customMaterialObj.favourite = false;
			var temp = _.split(customMaterialObj.customMaterialName, '_');
			customMaterialObj.customMaterialName = temp[0];
			tempArray.push(customMaterialObj);
		});
		NavigationService.apiCall('CustomMaterial/saveImportedCustMat', {
			cmArray: tempArray
		}, function (data) {
			callback(data);
		});
	}
});