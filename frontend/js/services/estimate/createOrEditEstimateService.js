myApp.service('createOrEditEstimateService', function ($http) {

    this.assembly = {
        enquiryId: "",
        assemblyName: "Assembly 1",
        assemplyNumber: "A1",
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
            subAssemblyNumber: "SA1",
            parts: [{
                partName: "part 1",
                partNumber: "A1SA1P1",
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
                    processingNumber: "A1SA1P1P1",
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
                    addonType: "",
                    addonItem: "",
                    addonNumber: "A1SA1P1A1",
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
                    extraNumber: "A1SA1P1E1",
                    quantity: 3,
                    totalCost: "",
                    remarks: ""
                }]
            }, {
                partName: "part 2",
                partNumber: "A1SA1P2",
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
                    processingNumber: "p1",
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
                    processingNumber: "p2",
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
                    addonType: "addonType1",
                    addonItem: "addonItem1",
                    addonNumber: "a1",
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
                    addonType: "addonType2",
                    addonItem: "addonItem2",
                    addonNumber: "a2",
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
                    extraNumber: "e1",
                    quantity: "",
                    totalCost: "",
                    remarks: ""
                }, {
                    extraItem: "extraItem1",
                    extraNumber: "e1",
                    quantity: "",
                    totalCost: "",
                    remarks: ""
                }]
            }],
            processing: [{
                processType: "proType1",
                processItem: "proItem1",
                processingNumber: "p1",
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
                processingNumber: "p2",
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
                addonType: "addonType1",
                addonItem: "addonItem1",
                addonNumber: "a1",
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
                addonType: "addonType2",
                addonItem: "addonItem2",
                addonNumber: "a2",
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
                extraNumber: "e1",
                quantity: "",
                totalCost: "",
                remarks: ""
            }, {
                extraItem: "extraItem1",
                extraNumber: "e1",
                quantity: "",
                totalCost: "",
                remarks: ""
            }]
        }, {
            subAssemblyName: "sub assembly 2",
            subAssemblyNumber: "SA2"
        }],
        processing: [{
            processType: "proType1",
            processItem: "proItem1",
            processingNumber: "p2",
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
            processingNumber: "p1",
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
            addonType: "addonType1",
            addonItem: "addonItem1",
            addonNumber: "a1",
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
            addonType: "addonType2",
            addonItem: "addonItem2",
            addonNumber: "a2",
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
            extraNumber: "e1",
            quantity: "",
            totalCost: "",
            remarks: ""
        }, {
            extraItem: "extraItem1",
            extraNumber: "e1",
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
    this.estimateViewData = function (estimateView, getLevelName, getId, callback) {

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
                getViewData = this.formData.assembly.subAssemblies[0].processing;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[0].subAssemblyNumber;
            }else if(getLevelName == "part"){ 
                getViewData = this.formData.assembly.subAssemblies[0].parts[0].processing;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[0].subAssemblyNumber;
                getViewData.partId = this.formData.assembly.subAssemblies[0].parts[0].partNumber;
            }
            callback(getViewData);
        } else if (estimateView == 'addons') {
            if(getLevelName == "assembly"){
                getViewData = this.formData.assembly.addons;
            }else if(getLevelName == "subAssembly"){
                getViewData = this.formData.assembly.subAssemblies[0].addons;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[0].subAssemblyNumber;                
            }else if(getLevelName == "part"){ 
                getViewData = this.formData.assembly.subAssemblies[0].parts[0].addons;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[0].subAssemblyNumber;
                getViewData.partId = this.formData.assembly.subAssemblies[0].parts[0].partNumber;
            }
            
            callback(getViewData);
        } else if (estimateView == 'extras') {
            if(getLevelName == "assembly"){
                getViewData = this.formData.assembly.extras;
            }else if(getLevelName == "subAssembly"){
                getViewData = this.formData.assembly.subAssemblies[0].extras;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[0].subAssemblyNumber;                
            }else if(getLevelName == "part"){ 
                getViewData = this.formData.assembly.subAssemblies[0].parts[0].extras;
                getViewData.subAssemblyId = this.formData.assembly.subAssemblies[0].subAssemblyNumber;
                getViewData.partId = this.formData.assembly.subAssemblies[0].parts[0].partNumber;           
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
        subAssObj.subAssemblyNumber = "SA" + this.formData.assembly.subAssemblies.length;

        this.formData.assembly.subAssemblies.push(subAssObj);
        var getLength = this.formData.assembly.subAssemblies.length;

        callback();
    }
    this.deleteSubAssembly = function (subAssemblyId, callback) {
         _.dropWhile(this.assembly.subAssemblies, { 'subAssemblyNumber': subAssemblyId });
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

        // var subAssIndex = _.find(this.formData.assembly.subAssemblies, {
        //     subAssemblyNumber: subAssId
        // });

        // var getLastObj = _.last(this.formData.assembly.subAssemblies).subAssemblyNumber;
        // var temp = subAssIndex.subAssemblyNumber +  + 1;
        // partObj.partNumber = subAssId + "P"+ getLength + temp;

        // console.log('**** inside subAssIndex of createOrEditEstimateService.js & data is ****', subAssIndex);

        this.formData.assembly.subAssemblies[0].parts.push(partObj);
        callback();
    }
    this.deletePart = function (subAssemblyId, partId, callback) { 
        subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);        
        data = _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts, { 'partNumber': partId });        
        callback();
    }


    this.getProcessingModalData = function (operation, type, level, processingObj, callback) {
        var processingDataObj = {}

        if (angular.isDefined(processingObj)) {            
            processingDataObj.processingObj = processingObj;
        }

        if (operation == "save") {
            processingDataObj.saveBtn = true;
            processingDataObj.editBtn = false;
            processingDataObj.type = type;
            processingDataObj.level = level;
        } else if (operation == "update") {
            processingDataObj.saveBtn = false;
            processingDataObj.editBtn = true;
        }

        callback(processingDataObj)
    }
    this.createOrEditProcessing = function (processingObj, level, callback) {

        if (level == 'assembly') {
            this.formData.assembly.processing.push(processingObj);
            callback();
        } else if (level == 'subAssembly') {
            this.formData.assembly.subAssemblies[0].processing.push(processingObj);
            callback();
        } else if (level == 'part') {
            this.formData.assembly.subAssemblies[0].parts[0].processing.push(processingObj);
            callback();
        }
    }
    this.deleteProcessing = function (processingId, level, subAssemblyId, partId, callback) {
        if (level == 'assembly') {
           data =  _.dropWhile(this.assembly.processing, { 'processingNumber':processingId });            
            console.log('**** array of obj ****', data);
        } else if (level == 'subAssembly') {
            subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);
            _.dropWhile(this.assembly.subAssemblies[subAssIndex].processing, { 'processingNumber':processingId });            
        } else if (level == 'part') {
            subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);
            partIndex = _.findIndex(this.assembly.subAssemblies[subAssIndex].parts, ['partNumber', partId]);
            _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts[partIndex].processing, { 'processingNumber':processingId });            
        }
        callback();      
    }


    this.getAddonModalData = function (operation, type, level, addonObj, callback) {
        var addonDataObj = {}

        if (angular.isDefined(addonObj)) {            
            addonDataObj.addonObj = addonObj;
        }

        if (operation == "save") {
            addonDataObj.saveBtn = true;
            addonDataObj.editBtn = false;
            addonDataObj.type = type;
            addonDataObj.level = level;
        } else if (operation == "update") {
            addonDataObj.saveBtn = false;
            addonDataObj.editBtn = true;
        }

        callback(addonDataObj)
    }
    this.createOrEditAddon = function (addonObj, level, callback) {

        if (level == 'assembly') {
            this.formData.assembly.addons.push(addonObj);
            callback();
        } else if (level == 'subAssembly') {
            this.formData.assembly.subAssemblies[0].addons.push(addonObj);
            callback();
        } else if (level == 'part') {
            this.formData.assembly.subAssemblies[0].parts[0].addons.push(addonObj);
            callback();
        }
    }
    this.deleteAddon = function (addonId, level, subAssemblyId, partId,  callback) {
        
        if (level == 'assembly') {
            _.dropWhile(this.assembly.addons, { 'addonNumber':addonId });
        } else if (level == 'subAssembly') {
            subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);
            _.dropWhile(this.assembly.subAssemblies[subAssIndex].addons, { 'addonNumber':addonId });
        } else if (level == 'part') {
            subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);
            partIndex = _.findIndex(this.assembly.subAssemblies[subAssIndex].parts, ['partNumber', partId]);
            _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts[partIndex].addons, { 'addonNumber':addonId });
        }
        callback();
    }


    this.getExtraModalData = function (operation, type, level, extraObj, callback) {
        var extraDataObj = {}

        if (angular.isDefined(extraObj)) {            
            extraDataObj.extraObj = extraObj;
        }

        if (operation == "save") {
            extraDataObj.saveBtn = true;
            extraDataObj.editBtn = false;
            extraDataObj.type = type;
            extraDataObj.level = level;
        } else if (operation == "update") {
            extraDataObj.saveBtn = false;
            extraDataObj.editBtn = true;
        }

        callback(extraDataObj)
    }
    this.createOrEditExtra = function (extraObj, level, callback) {
        console.log('**** extraObj, level, callback ****', extraObj, level, callback);
        if (level == 'assembly') {
            this.formData.assembly.extras.push(extraObj);
            callback();
        } else if (level == 'subAssembly') {
            this.formData.assembly.subAssemblies[0].extras.push(extraObj);
            callback();
        } else if (level == 'part') {
            this.formData.assembly.subAssemblies[0].parts[0].extras.push(extraObj);
            callback();
        }
    }
    this.deleteExtra = function (extraId, level, subAssemblyId, partId, callback) {
        if (level == 'assembly') {
            _.dropWhile(this.assembly.extras, { 'extraNumber':extraId });
        } else if (level == 'subAssembly') {
            subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);
            _.dropWhile(this.assembly.subAssemblies[subAssIndex].extras, { 'extraNumber':extraId });
        } else if (level == 'part') {
            subAssIndex = _.findIndex(this.assembly.subAssemblies, ['subAssemblyNumber', subAssemblyId]);
            partIndex = _.findIndex(this.assembly.subAssemblies[subAssIndex].parts, ['partNumber', partId]);
            _.dropWhile(this.assembly.subAssemblies[subAssIndex].parts[partIndex].extras, { 'extraNumber':extraId });
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


});