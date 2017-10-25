myApp.service('createOrEditEstimateService', function ($http) {

    this.assembly = {
        enquiryId: "",
        assemblyName: "Assembly 1",
        assemplyNumber: "AS1",
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
        subAssemblies: [{
            subAssemblyName: "sub assembly 1",
            subAssemblyNumber: "AS1SA1",
            parts: [{
                partName: "part 1",
                partNumber: "AS1SA1PT1",
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
                processing: [{
                    processType: "",
                    processItem: "",
                    processingNumber: "AS1SA1PT1PR1",
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
                }],
                addons: [{
                    addonType: "AddonPart1",
                    addonItem: "",
                    addonNumber: "AS1SA1PT1AD1",
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
                }],
                extras: [{
                    extraItem: "extra 1",
                    extraNumber: "AS1SA1PT1EX1",
                    quantity: 3,
                    totalCost: "",
                    remarks: ""
                }]
            }, {
                partName: "part 2",
                partNumber: "AS1SA1PT2",
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
                processing: [{
                    processType: "proType1",
                    processItem: "proItem1",
                    processingNumber: "AS1SA1PT2PR1",
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
                }, {
                    processType: "proType2",
                    processItem: "proItem2",
                    processingNumber: "AS1SA1PT2PR2",
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
                }],
                addons: [{
                    addonType: "AddonPart2",
                    addonItem: "addonItem1",
                    addonNumber: "AS1SA1PT2AD1",
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
                }, {
                    addonType: "addonPart2",
                    addonItem: "addonItem2",
                    addonNumber: "AS1SA1PT2AD2",
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
                }],
                extras: [{
                    extraItem: "extraItem1",
                    extraNumber: "AS1SA1PT2EX1",
                    quantity: "",
                    totalCost: "",
                    remarks: ""
                }, {
                    extraItem: "extraItem1",
                    extraNumber: "AS1SA1PT2EX2",
                    quantity: "",
                    totalCost: "",
                    remarks: ""
                }]
            }],
            processing: [{
                processType: "proSub",
                processItem: "proItem1",
                processingNumber: "AS1SA1PR1",
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
            }, {
                processType: "proType2",
                processItem: "proItem2",
                processingNumber: "AS1SA1PR2",
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
            }],
            addons: [{
                addonType: "addonSub1",
                addonItem: "addonItem1",
                addonNumber: "AS1SA1AD1",
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
            }, {
                addonType: "addonSub1",
                addonItem: "addonItem2",
                addonNumber: "AS1SA1AD2",
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
            }],
            extras: [{
                extraItem: "extraItem1",
                extraNumber: "AS1SA1EX1",
                quantity: "",
                totalCost: "",
                remarks: ""
            }, {
                extraItem: "extraItem1",
                extraNumber: "AS1SA1EX2",
                quantity: "",
                totalCost: "",
                remarks: ""
            }]
        }, {
            subAssemblyName: "sub assembly 2",
            subAssemblyNumber: "AS1SA2",
            parts: [],
            processing: [],
            addons: [],
            extras: []
        }],
        processing: [{
            processType: "proAss",
            processItem: "proItem1",
            processingNumber: "AS1PR1",
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
        }, {
            processType: "proType2",
            processItem: "proItem2",
            processingNumber: "AS1PR2",
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
        }],
        addons: [{
            addonType: "addonAss",
            addonItem: "addonItem1",
            addonNumber: "AS1AD1",
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
        }, {
            addonType: "addonAss",
            addonItem: "addonItem2",
            addonNumber: "AS1AD2",
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
        }],
        extras: [{
            extraItem: "extraItem1",
            extraNumber: "AS1EX1",
            quantity: "",
            totalCost: "",
            remarks: ""
        }, {
            extraItem: "extraItem1",
            extraNumber: "AS1EX2",
            quantity: "",
            totalCost: "",
            remarks: ""
        }]
    };

    this.subAssembly = {
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
        parts: [],
        processing: [],
        addons: [],
        extras: []
    };

    this.part = {
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
        processing: [],
        addons: [],
        extras: []
    };

    this.processing = {
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

    this.addon = {
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

    this.extra = {
        extraItem: "",
        quantity: "",
        totalCost: "",
        remarks: ""
    };

    this.formData = {
        assembly: this.assembly
    }

    this.getEstimateData = function (callback) {
        callback(this.formData);
    }
    this.estimateView = function (estimateView, callback) {
        getEstimateView = "../frontend/views/content/estimate/estimateViews/" + estimateView + ".html";
        callback(getEstimateView);
    }
    this.estimateViewData = function (estimateView, getLevelName, subAssemblyId, partId, callback) {

        var getViewData = [];

        if (estimateView == 'assembly') {
            getViewData = this.formData.assembly;            
            callback(getViewData);
        } else if (estimateView == 'subAssembly') {
            getViewData = this.formData.assembly.subAssemblies[0];
            callback(getViewData);
        } else if (estimateView == 'partDetail') {
            // get part all detail (with processing count, addons count & extras count) from API
            var getPartDetail = {};
            callback();
        } else if (estimateView == 'editPartItemDetail') {
            // get part Item detail only from API
            var getPartItemDetail = {};
            callback();
        } else if (estimateView == 'processing') {
            if(getLevelName == "assembly"){
                getViewData = this.formData.assembly.processing;
            }else if(getLevelName == "subAssembly"){
                var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);                 
                getViewData = this.formData.assembly.subAssemblies[subAssIndex].processing;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
            }else if(getLevelName == "part"){ 
                var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
                var partIndex = this.getPartIndex(subAssIndex, partId);
                getViewData = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].processing;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
                getViewData.partId = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].partNumber;
            }
            callback(getViewData);
        } else if (estimateView == 'addons') {
            if(getLevelName == "assembly"){
                getViewData = this.formData.assembly.addons;
            }else if(getLevelName == "subAssembly"){
                var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);                                 
                getViewData = this.formData.assembly.subAssemblies[subAssIndex].addons;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;                
            }else if(getLevelName == "part"){ 
                var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
                var partIndex = this.getPartIndex(subAssIndex, partId);                
                getViewData = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].addons;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
                getViewData.partId = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].partNumber;
            }
            
            callback(getViewData);
        } else if (estimateView == 'extras') {
            if(getLevelName == "assembly"){
                getViewData = this.formData.assembly.extras;
            }else if(getLevelName == "subAssembly"){
                var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);                                 
                getViewData = this.formData.assembly.subAssemblies[subAssIndex].extras;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;                
            }else if(getLevelName == "part"){ 
                var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);             
                var partIndex = this.getPartIndex(subAssIndex, partId);                                    
                getViewData = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[subAssIndex].subAssemblyNumber;
                getViewData.partId = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].partNumber;           
            }
            callback(getViewData);
        } else if (estimateView == 'customMaterial') {
        
            // get all custome materials of estimate from API
            var getAllCustomMaterial = [{}];
            callback();
        }

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

        callback(subAssDataObj)

    }
    this.createOrEditSubAssembly = function (subAssObj, callback) {
        var id = this.getSubAssemblyNumber();
        
        subAssObj.subAssemblyNumber = "AS1SA" + id;
        this.formData.assembly.subAssemblies.push(subAssObj);
        var getLength = this.formData.assembly.subAssemblies.length;

        callback();
    }
    this.deleteSubAssembly = function (subAssemblyId, callback) {
        this.assembly.subAssemblies = _.dropWhile(this.assembly.subAssemblies, { 'subAssemblyNumber': subAssemblyId });
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
    this.createOrEditPart = function (partObj, subAssId, callback) {
        var subAssIndex = this.getSubAssemblyIndex(subAssId);
        var id = this.getPartNumber(subAssIndex);
        
        partObj.partNumber = subAssId + 'PT' + id;
        this.formData.assembly.subAssemblies[subAssIndex].parts.push(partObj);

        callback();
    }
    this.deletePart = function (subAssemblyId, partId, callback) { 
        var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
        this.assembly.subAssemblies[subAssIndex].parts = _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts, { 'partNumber': partId });        
        callback();
    }

    this.createProcessing = function (processingObj, level, subAssemblyId, partId, callback) {

        var id;
        if (level == 'assembly') {
            id = this.getProcessingNumber(level);
            processingObj.processingNumber = 'AS1' + 'PR' + id;
            this.formData.assembly.processing.push(processingObj);
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            id = this.getProcessingNumber(level, subAssIndex);
            processingObj.processingNumber = subAssemblyId + 'PR' + id;
            this.formData.assembly.subAssemblies[subAssIndex].processing.push(processingObj);
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            id = this.getProcessingNumber(level, subAssIndex, partIndex);
            processingObj.processingNumber = partId + 'PR' + id;
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].processing.push(processingObj)
        }
        callback();
    }
    this.editProcessing = function (processingObj, level, subAssemblyId, partId, callback) {
        
        if (level == 'assembly') {
            this.formData.assembly.processing.push(processingObj);
            callback();
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            this.formData.assembly.subAssemblies[subAssIndex].processing.push(processingObj);
            callback();
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].processing.push(processingObj);
            callback();
        }
    }
    this.deleteProcessing = function (processingId, level, subAssemblyId, partId, callback) {
        console.log('**** inside deletePro s :: processingId, level, subAssemblyId, partId****', processingId, level, subAssemblyId, partId);
        if (level == 'assembly') {
            this.assembly.processing =  _.dropWhile(this.assembly.processing, { 'processingNumber':processingId });            
            console.log('**** this.assembly.processing ****', this.assembly.processing);
        } else if (level == 'subAssembly') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            this.assembly.subAssemblies[subAssIndex].processing =  _.dropWhile(this.assembly.subAssemblies[subAssIndex].processing, { 'processingNumber':processingId });            
        } else if (level == 'part') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            partIndex = this.getPartIndex(subAssIndex, partId);
            this.assembly.subAssemblies[subAssIndex].parts[partIndex].processing = _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts[partIndex].processing, { 'processingNumber':processingId });            
        }
        callback();      
    }


    this.createAddon = function (addonObj, level, subAssemblyId, partId, callback) {
        
        var id;
        if (level == 'assembly') {
            id = this.getAddonNumber(level);
            addonObj.addonNumber = 'AS1' + 'AD' + id;
            this.formData.assembly.addons.push(addonObj);
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            id = this.getAddonNumber(level, subAssIndex);
            addonObj.addonNumber = subAssemblyId + 'AD' + id;
            this.formData.assembly.subAssemblies[subAssIndex].addons.push(addonObj);
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            id = this.getAddonNumber(level, subAssIndex, partIndex);
            addonObj.addonNumber = partId + 'AD' + id;
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].addons.push(addonObj)
        }
        callback();
    }
    this.editAddon = function (addonObj, level, subAssemblyId, partId, callback) {
        var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
        var partIndex = this.getPartIndex(subAssIndex, partId);  
        var addonIndex = this.getAddonIndex(addonObj.addonNumber, subAssIndex, partIndex);
        console.log('**** addonIndex ****', addonIndex);
        if (level == 'assembly') {
            this.formData.assembly.addons[addonIndex].push(addonObj);
            callback();
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            this.formData.assembly.subAssemblies[subAssIndex].addons[addonIndex].push(addonObj);
            callback();
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].addons[addonIndex].push(addonObj);
            callback();
        }
    }
    this.deleteAddon = function (addonId, level, subAssemblyId, partId,  callback) {
        
        if (level == 'assembly') {
            this.assembly.addons = _.dropWhile(this.assembly.addons, { 'addonNumber':addonId });
        } else if (level == 'subAssembly') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            this.assembly.subAssemblies[subAssIndex].addons = _.dropWhile(this.assembly.subAssemblies[subAssIndex].addons, { 'addonNumber':addonId });
        } else if (level == 'part') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            partIndex = this.getPartIndex(subAssIndex, partId);
            this.assembly.subAssemblies[subAssIndex].parts[partIndex].addons = _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts[partIndex].addons, { 'addonNumber':addonId });
        }
        callback();
    }


    this.createExtra = function (extraObj, level, subAssemblyId, partId, callback) {

        var id;
        if (level == 'assembly') {
            id = this.getAddonNumber(level);
            extraObj.addonNumber = 'AS1' + 'EX' + id;
            this.formData.assembly.extras.push(extraObj);
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            id = this.getAddonNumber(level, subAssIndex);
            extraObj.addonNumber = subAssemblyId + 'EX' + id;
            this.formData.assembly.subAssemblies[subAssIndex].extras.push(extraObj);
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            id = this.getAddonNumber(level, subAssIndex, partIndex);
            extraObj.addonNumber = partId + 'EX' + id;
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras.push(extraObj)
        }
        callback();
    }
    this.editExtra = function (extraObj, level, subAssemblyId, partId, callback) {
        
        if (level == 'assembly') {
            this.formData.assembly.extras.push(extraObj);
            callback();
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            this.formData.assembly.subAssemblies[subAssIndex].extras.push(extraObj);
            callback();
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras.push(extraObj);
            callback();
        }
    }
    this.deleteExtra = function (extraId, level, subAssemblyId, partId, callback) {
        if (level == 'assembly') {
            this.assembly.extras = _.dropWhile(this.assembly.extras, { 'extraNumber':extraId });
        } else if (level == 'subAssembly') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            this.assembly.subAssemblies[subAssIndex].extras = _.dropWhile(this.assembly.subAssemblies[subAssIndex].extras, { 'extraNumber':extraId });
        } else if (level == 'part') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            partIndex = this.getPartIndex(subAssIndex, partId);
            this.assembly.subAssemblies[subAssIndex].parts[partIndex].extras = _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts[partIndex].extras, { 'extraNumber':extraId });
        }
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


    this.getSubAssemblyIndex = function(subAssId){
        var subAssIndex = _.findIndex(this.formData.assembly.subAssemblies, {
            subAssemblyNumber: subAssId
        });

        return subAssIndex;
    }
    this.getPartIndex = function(subAssIndex, partId){
        var partIndex = _.findIndex(this.assembly.subAssemblies[subAssIndex].parts, ['partNumber', partId]);
        return partIndex;
    }
    this.getAddonIndex = function(addonId, subAssIndex, partIndex){
        var addonIndex; 
        if (angular.isDefined(subAssIndex)) {
            if (angular.isDefined(partIndex)) {
                addonIndex = _.findIndex(this.assembly.subAssemblies[subAssIndex].parts[partIndex].addons, ['addonNumber', addonId]);                
            } else {
                addonIndex = _.findIndex(this.assembly.subAssemblies[subAssIndex].addons, ['addonNumber', addonId]);
            }
        } else {
            addonIndex = _.findIndex(this.assembly.addons, ['addonNumber', addonId]);            
        }
        return addonIndex;
    }

    this.getSubAssemblyNumber = function(){
        var id;
        if(this.formData.assembly.subAssemblies.length == 0) {
            id = 1;            
        }
        else {
            temp = _.last(this.formData.assembly.subAssemblies).subAssemblyNumber; 
            temp = _.split(temp, 'SA');            
            id = _.toNumber(temp[1]) + 1;
        }

        return id;
    }
    this.getPartNumber = function(subAssIndex){
      var id;
        if(this.formData.assembly.subAssemblies[subAssIndex].parts.length == 0) {
            id = 1;            
        }
        else {
            temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].parts).partNumber; 
            temp = _.split(temp, 'PT');            
            id = _.toNumber(temp[1]) + 1;
        }

        return id;
    }
    this.getProcessingNumber = function(level, subAssIndex, partIndex){
        var id;
        if(level == 'assembly'){
            if(this.formData.assembly.processing.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.processing).processingNumber; 
            }
    
        } else if(level == 'subAssembly') {
            if(this.formData.assembly.subAssemblies[subAssIndex].processing.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].processing).processingNumber; 
            }
    
        } else if(level == 'part') {
            if(this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].processing.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].processing).processingNumber; 
            }
        }
        
        temp = _.split(temp, 'PR');            
        id = _.toNumber(temp[1]) + 1;

        return id;
    }
    this.getAddonNumber = function(level, subAssIndex, partIndex){
        var id;
        if(level == 'assembly'){
            if(this.formData.assembly.addons.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.addons).addonNumber; 
            }
    
        } else if(level == 'subAssembly') {
            if(this.formData.assembly.subAssemblies[subAssIndex].addons.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].addons).addonNumber; 
            }
    
        } else if(level == 'part') {
            if(this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].addons.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].addons).addonNumber; 
            }
        }
        
        temp = _.split(temp, 'AD');            
        id = _.toNumber(temp[1]) + 1;

        return id;
    }
    this.getExtraNumber = function(level, subAssIndex, partIndex){
        var id;
        if(level == 'assembly'){
            if(this.formData.assembly.extras.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.extras).extraNumber; 
            }
    
        } else if(level == 'subAssembly') {
            if(this.formData.assembly.subAssemblies[subAssIndex].extras.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].extras).extraNumber;             }
    
        } else if(level == 'part') {
            if(this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras.length == 0) {
                id = 1;            
                return id;
            }
            else {
                temp = _.last(this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras).extraNumber; 
            }
        }
        
        temp = _.split(temp, 'EX');            
        id = _.toNumber(temp[1]) + 1;

        return id;
    }

});