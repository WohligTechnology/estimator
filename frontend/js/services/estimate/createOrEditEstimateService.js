myApp.service('createOrEditEstimateService', function ($http, NavigationService) {

	var bulkArray = [];

	var processing = {
		processType: "",
		processItem: "",
		rate: "",
		quantity: {
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
		shortcut: "",
		scaleFactor: "",
		finalCalculation: {
			materialPrice: "",
			itemUnitPrice: "",
			totalCostForQuantity: ""
		},
		keyValueCalculations: {
			perimeter: "",
			sheetMetalArea: "",
			surfaceArea: "",
			weight: ""
		},
		sectionCode: "",
		material: "",
		size: "",
		quantity: "",
		variable: [{}],
		processing: [_.cloneDeep(processing)],
		addons: [_.cloneDeep(addon)],
		extras: [_.cloneDeep(extra)]
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
		subAssemblyParts: [],
		processing: [_.cloneDeep(processing)],
		addons: [_.cloneDeep(addon)],
		extras: [_.cloneDeep(extra)]
	};

	var assembly = {
		enquiryId: "",
		assemblyName: "Assembly 1",
		assemblyNumber: "AS1",
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
		subAssemblies: [_.cloneDeep(subAssembly)],
		processing: [_.cloneDeep(subAssembly)],
		addons: [_.cloneDeep(subAssembly)],
		extras: [_.cloneDeep(subAssembly)]
	};

	var formData = {
		assembly: {},
		customMaterial: [_.cloneDeep(customMaterial)],
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

	this.getCustomMaterialData = function (callback) {
		callback(formData.customMaterial);
	}
	this.getCurretEstimateObj = function (callback) {
		callback(formData.assembly);
	}
	this.getEstimateData = function (draftEstimateId, callback) {
		if ($.jStorage.get('estimateObject') != null) {
			debugger;
			formData.assembly = $.jStorage.get('estimateObject');
			callback($.jStorage.get('estimateObject'));

		} else {
			debugger;
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
		}
	}

	this.estimateView = function (estimateView, callback) {
		getEstimateView = "../frontend/views/content/estimate/estimateViews/" + estimateView + ".html";
		callback(getEstimateView);
	}
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
		callback(getViewData);
	}
	this.saveCurrentEstimate = function () {
		NavigationService.apiCall('DraftEstimate/save', formData.assembly, function (data) {
			$.jStorage.deleteKey("estimateObject");	
			callback(data.data);
		});
	}
	this.editAssemblyName = function (estimateName, draftEstimateId, callback) {
		var tempEstimateObj = {
			_id: draftEstimateId,
			assemblyName: estimateName
		}
		NavigationService.apiCall('DraftEstimate/save', tempEstimateObj, function (data) {
			callback(data.data);
		});
	}
	this.getAllAssemblyNumbers = function (callback) {
		NavigationService.boxCall('Estimate/getAllAssembliesNo', function (data) {
			callback(data.data);
		});
	}

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
	this.getAllSubAssNumbers = function (callback) {
		NavigationService.boxCall('EstimateSubAssembly/getAllSubAssNo', function (data) {
			callback(data.data);
		});
	}
	this.createSubAssembly = function (subAssObj, callback) {
		var id = this.getSubAssemblyNumber();
		var tempSubAssObj = _.cloneDeep(subAssembly);
		tempSubAssObj.subAssemblyNumber = formData.assembly.assemblyNumber + "SA" + id;
		tempSubAssObj.subAssemblyName = subAssObj.subAssemblyName;
		formData.assembly.subAssemblies.push(tempSubAssObj);
		callback();
	}
	this.deleteSubAssembly = function (subAssemblyId, callback) {
		_.remove(formData.assembly.subAssemblies, function (obj) {
			return obj.subAssemblyNumber == subAssemblyId;
		});
		callback();
	}
	this.deleteMultipleSubAssemblies = function (bulkArray, callback) {
		angular.forEach(bulkArray,  function (record) {
			_.remove(formData.assembly.subAssemblies, function (obj) {
				return record == obj.subAssemblyNumber;
			});
		});
		callback();
	}

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
	this.getAllPartNumbers = function (callback) {
		NavigationService.boxCall('EstimatePart/getAllPartsNo', function (data) {
			callback(data.data);
		});
	}
	this.createPart = function (partObj, subAssId, callback) {
		var subAssIndex = this.getSubAssemblyIndex(subAssId);
		var id = this.getPartNumber(subAssIndex);
		var tempPartObj = _.cloneDeep(part);
		tempPartObj.partNumber = subAssId + 'PT' + id;
		tempPartObj.partName = partObj.partName;

		formData.assembly.subAssemblies[subAssIndex].subAssemblyParts.push(tempPartObj);
		callback();
	}
	this.deletePart = function (subAssemblyId, partId, callback) {
		var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
		_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (obj) {
			return obj.partNumber == partId
		});
		callback();
	}
	this.deleteMultipleParts = function (subAssemblyId, bulkArray, callback) {
		subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
		angular.forEach(bulkArray,  function (record) {
			_.remove(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, function (obj) {
				return record == obj.partNumber;
			});
		});
		callback();
	}
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
	this.generatePartName = function (subAssId) {

		var subAssIndex = this.getSubAssemblyIndex(subAssId);
		var id = this.getPartNumber(subAssIndex);
		var obj = {
			partName: (subAssId + 'PT' + id)
		};
		return obj;
	}


	this.createProcessing = function (processingObj, level, subAssemblyId, partId, callback) {

		var id;
		if (level == 'assembly') {
			id = this.getProcessingNumber(level);
			processingObj.processingNumber = 'AS1' + 'PR' + id;
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
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].processing.push(processingObj)
		}
		callback();
	}
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

	this.createAddon = function (addonObj, level, subAssemblyId, partId, callback) {
		var id;
		if (level == 'assembly') {
			id = this.getAddonNumber(level);
			addonObj.addonNumber = 'AS1' + 'AD' + id;
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
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].addons.push(addonObj)
		}
		callback();
	}
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


	this.createExtra = function (extraObj, level, subAssemblyId, partId, callback) {
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
			formData.assembly.subAssemblies[subAssIndex].subAssemblyParts[partIndex].extras.push(extraObj)
		}
		callback();
	}
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
	this.createCustomMaterial = function (customMaterialObj) {
		//     formData.customMaterial.push(customMaterialObj);
		//     console.log(formData.customMaterial..........',formData.customMaterial);

		// }
		// this.createHardFacingAlloy = function (hardFacingAlloyObj) {
		//     formData.customMaterial.hardFacingAlloys.push(hardFacingAlloyObj);
		//     callback();
		// }
		// this.saveCurrentCustomMaterial = function () {
		//     NavigationService.apiCall('/save', formData.customMaterial, function (data) {
		//         callback(data.data);
		//     });
	}


	this.getSubAssemblyIndex = function (subAssId) {

		var subAssIndex = _.findIndex(formData.assembly.subAssemblies, {
			subAssemblyNumber: subAssId
		});

		return subAssIndex;
	}
	this.getPartIndex = function (subAssIndex, partId) {

		var partIndex = _.findIndex(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts, ['partNumber', partId]);
		return partIndex;
	}
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


	//- to import assembly
	this.getImportAssemblyData = function (assemblyNumber, callback) {
		//temp = _.last(formData.assembly).assemblyNumber;
		temp = formData.assembly.assemblyNumber;
		tempObj = {
			assemblyNumber: assemblyNumber,
			lastAssemblyNumber: temp
		}
		NavigationService.apiCall('Estimate/importAssembly', tempObj, function (data) {
			var assemblyObj = data.data.assemblyObj;
			assemblyObj.assemblyName = assemblyObj.assemblyNumber;
			formData.assembly.push(assemblyObj);
			callback();
		});
	}
	//- to import subAssembly
	this.getImportSubAssemblyData = function (subAssNumber, callback) {
		temp = _.last(formData.assembly.subAssemblies).subAssemblyNumber;
		tempObj = {
			subAssemblyNumber: subAssNumber,
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
	this.getImportPartData = function (subAssNumber, partNumber, callback) {
		var subAssIndex = this.getSubAssemblyIndex(subAssNumber);
		temp = _.last(formData.assembly.subAssemblies[subAssIndex].subAssemblyParts).partNumber;
		tempObj = {
			lastPartNumber: temp,
			partNumber: partNumber
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
				temp = AS1 + 'PR0';
			} else {
				temp = _.last(formData.assembly.processing).processingNumber;
			}
			tempObj = {
				processingNumber: processingId,
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
				processingNumber: processingId,
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
				processingNumber: processingId,
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
				temp = 'AS1AD0';
			} else {
				temp = _.last(formData.assembly.addons).addonNumber;
			}
			tempObj = {
				addonNumber: addonId,
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
				addonNumber: addonId,
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
				addonNumber: addonId,
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
				temp = 'AS1EX0';
			} else {
				temp = _.last(formData.assembly.extras).extraNumber;
			}
			tempObj = {
				extraNumber: extraId,
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
				extraNumber: extraId,
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
				extraNumber: extraId,
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
			NavigationService.boxCall('EstimateProcessing/getAllProcessingsNo', function (data) {
				callback(data.data);
			});
		} else if (type == "Addon") {
			NavigationService.boxCall('EstimateAddons/getAllAddonsNo', function (data) {
				callback(data.data);
			});
		} else {
			NavigationService.boxCall('EstimateExtras/getAllExtrasNo', function (data) {
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

});