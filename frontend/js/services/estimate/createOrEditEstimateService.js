myApp.service('createOrEditEstimateService', function ($http, NavigationService) {
    
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
        extraNumber: "",
        quantity: "",
        totalCost: "",
        remarks: ""
    };

    this.part = {
        partName: "Part1",
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
        processing: [_.cloneDeep(this.processing)],
        addons: [_.cloneDeep(this.addon)],
        extras: [_.cloneDeep(this.extra)]
    };

    this.subAssembly = {
        subAssemblyName: "nhjjhgjhggjgjg",
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
        parts: [_.cloneDeep(this.part)],
        processing: [_.cloneDeep(this.processing)],
        addons: [_.cloneDeep(this.addon)],
        extras: [_.cloneDeep(this.extra)]
    };

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
        subAssemblies: [_.cloneDeep(this.subAssembly)],
        processing: [{
            processType: "proAss AS1PR1",
            processItem: "proItem AS1PR1",
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
            processType: "proType AS1PR2",
            processItem: "proItem AS1PR2",
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
            addonType: "addonAss AS1AD1",
            addonItem: "addonItem AS1AD1",
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
            addonType: "addonAss AS1AD2",
            addonItem: "addonItem AS1AD2",
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

    this.formData = {
        assembly: this.assembly
    };

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
        } else if (estimateView == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);                             
            getViewData = this.formData.assembly.subAssemblies[subAssIndex];
        } else if (estimateView == 'partDetail') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);
            getViewData = this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex];
        } else if (estimateView == 'editPartItemDetail') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);
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
        } 
        callback(getViewData);
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
    this.createSubAssembly = function (subAssObj, callback) {
        var id = this.getSubAssemblyNumber();
        subAssObj.subAssemblyNumber = "AS1SA" + id;
        this.formData.assembly.subAssemblies.push(subAssObj);
        callback();
    }
    this.deleteSubAssembly = function (subAssemblyId, callback) {        
        _.remove(this.assembly.subAssemblies, function(obj){
            return obj.subAssemblyNumber ==  subAssemblyId; 
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
    this.createPart = function (partObj, subAssId, callback) {
        var subAssIndex = this.getSubAssemblyIndex(subAssId);
        var id = this.getPartNumber(subAssIndex);
        
        partObj.partNumber = subAssId + 'PT' + id;
        this.formData.assembly.subAssemblies[subAssIndex].parts.push(partObj);
        callback();
    }
    this.deletePart = function (subAssemblyId, partId, callback) { 
        var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
        _.remove(this.assembly.subAssemblies[subAssIndex].parts, function(obj){
             return obj.partNumber == partId 
        });        
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
    this.deleteProcessing = function (processingId, level, subAssemblyId, partId, callback) {
        if (level == 'assembly') {
            _.remove(this.assembly.processing, function(obj){
                 return obj.processingNumber == processingId 
                });            
        } else if (level == 'subAssembly') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            _.remove(this.assembly.subAssemblies[subAssIndex].processing, function(obj){
                return obj.processingNumber == processingId 
               });            
        } else if (level == 'part') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            partIndex = this.getPartIndex(subAssIndex, partId);
            _.remove(this.assembly.subAssemblies[subAssIndex].parts[partIndex].processing, function(obj){
                return obj.processingNumber == processingId 
               });            
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
    this.deleteAddon = function (addonId, level, subAssemblyId, partId,  callback) {
        
        if (level == 'assembly') {
            _.remove(this.assembly.addons, function(obj){
                 return obj.addonNumber == addonId 
                });
        } else if (level == 'subAssembly') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            _.remove(this.assembly.subAssemblies[subAssIndex].addons, function(obj){
                return obj.addonNumber == addonId 
               });
        } else if (level == 'part') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            partIndex = this.getPartIndex(subAssIndex, partId);
            _.remove(this.assembly.subAssemblies[subAssIndex].parts[partIndex].addons, function(obj){
                return obj.addonNumber == addonId 
               });
        }
        callback();
    }


    this.createExtra = function (extraObj, level, subAssemblyId, partId, callback) {
        var id;
        if (level == 'assembly') {
            id = this.getExtraNumber(level);
            extraObj.extraNumber = 'AS1' + 'EX' + id;
            this.formData.assembly.extras.push(extraObj);
        } else if (level == 'subAssembly') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            id = this.getExtraNumber(level, subAssIndex);
            extraObj.extraNumber = subAssemblyId + 'EX' + id;
            this.formData.assembly.subAssemblies[subAssIndex].extras.push(extraObj);
        } else if (level == 'part') {
            var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            var partIndex = this.getPartIndex(subAssIndex, partId);  
            id = this.getExtraNumber(level, subAssIndex, partIndex);
            extraObj.extraNumber = partId + 'EX' + id;
            this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras.push(extraObj)
        }
        callback();
    }
    this.deleteExtra = function (extraId, level, subAssemblyId, partId, callback) {
        if (level == 'assembly') {
            _.remove(this.assembly.extras, function(obj){
                return obj.extraNumber == extraId 
            });
        } else if (level == 'subAssembly') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            _.remove(this.assembly.subAssemblies[subAssIndex].extras, function(obj){
                return obj.extraNumber == extraId 
            });
        } else if (level == 'part') {
            subAssIndex = this.getSubAssemblyIndex(subAssemblyId);
            partIndex = this.getPartIndex(subAssIndex, partId);
            _.remove(this.assembly.subAssemblies[subAssIndex].parts[partIndex].extras, function(obj){
                return obj.extraNumber == extraId 
            });
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


    this.getSubAssemblyData = function (subAssId, callback){
        console.log('**** subAssId ****', subAssId);
        //tempObj = { subAssemblyNumber: subAssId }  
        // NavigationService.apiCall('subAssemblies/save', tempObj, function (data) {
        //     var subAssObj = data.data.results;
        //     this.formData.assembly.subAssemblies.push(subAssObj);        
             callback();
        // });
    }
    this.getPartData = function (partId, callback){
        //tempObj = { partNumber: partId }  
        // NavigationService.apiCall('parts/save', tempObj, function (data) {
        //     var partObj = data.data.results;
            temp = _.split(partId, 'PT');            
        //     this.formData.assembly.subAssemblies[temp[0]].parts.push(partObj);        
            console.log('****subAssemblyId, partId ****', temp[0], partId);
        
            callback();
        // });
    }
    this.getProcessingData = function (processingId, level, subAssemblyId, partId, callback){
        console.log('**** inside service ... , processingId, level, subAssemblyId, partId****', processingId, level, subAssemblyId, partId);
        //tempObj = { processingNumber: processingId }  
        // NavigationService.apiCall('processing/save', tempObj, function (data) {
        //     var processingObj = data.data.results;
            // if (level == 'assembly') {
            //     this.formData.assembly.processing.push(processingObj);
            // } else if (level == 'subAssembly') {
            //     var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            //     this.formData.assembly.subAssemblies[subAssIndex].processing.push(processingObj);
            // } else if (level == 'part') {
            //     var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            //     var partIndex = this.getPartIndex(subAssIndex, partId);  
            //     this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].processing.push(processingObj)
            // }
        //     callback();
        // });
    }
    this.getAddonData = function (addonId, level, subAssemblyId, partId, callback){
        console.log('**** addonId, level, subAssemblyId, partId ****', addonId, level, subAssemblyId, partId);
        //tempObj = { addonNumber: addonId }  
        // NavigationService.apiCall('addons/save', tempObj, function (data) {
        //     var addonObj = data.data.results;
            // if (level == 'assembly') {
            //     this.formData.assembly.addons.push(addonObj);
            // } else if (level == 'subAssembly') {
            //     var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            //     this.formData.assembly.subAssemblies[subAssIndex].addons.push(addonObj);
            // } else if (level == 'part') {
            //     var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            //     var partIndex = this.getPartIndex(subAssIndex, partId);  
            //     this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].addons.push(addonObj)
            // }
        //     callback();
        // });
    }
    this.getExtraData = function (extraId, level, subAssemblyId, partId, callback){
        console.log('**** extraId, level, subAssemblyId, partId ****', extraId, level, subAssemblyId, partId);
        //tempObj = { extraNumber: extraId }
        // NavigationService.apiCall('extras/save', tempObj, function (data) {
        //     var extraObj = data.data.results;
            // if (level == 'assembly') {
            //     this.formData.assembly.extras.push(extraObj);
            // } else if (level == 'subAssembly') {
            //     var subAssIndex = this.getSubAssemblyIndex(subAssemblyId);            
            //     this.formData.assembly.subAssemblies[subAssIndex].extras.push(extraObj);
            // } else if (level == 'part') {
            //     var subAssIndex = this.getSubAssemblyIndex(subAssemblyId); 
            //     var partIndex = this.getPartIndex(subAssIndex, partId);  
            //     this.formData.assembly.subAssemblies[subAssIndex].parts[partIndex].extras.push(extraObj)
            // }
        //     callback();
        // });
    }

});