myApp.service('createOrEditEstimateService', function ($http) {

    this.assembly = {
        enquiryId: "",
        assemblyName: "",
        assemplyNumber: "",
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
            subAssemblyName: "sjdsjagd",
            subAssemblyNumber: "sa1",
            parts: []
        }],
        processing: [],
        addons: [],
        extras: []
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

        if (estimateView == 'assembly') {
            // get all subAssemblies from API
            var getAllSubAssemblies = [{}];
            callback();
        } else if (estimateView == 'subAssembly') {
            // get all parts from API
            var getAllParts = [{}];
            callback();
        } else if (estimateView == 'partDetail') {
            // get part all detail (with processing count, addons count & extras count) from API
            var getPartDetail = {};
            callback();
        } else if (estimateView == 'editPartItemDetail') {
            // get part Item detail only from API
            var getPartItemDetail = {};
            callback();
        } else if (estimateView == 'processing') {
            // get all processing of corresponding level (assembly, subAssembly & part) from API
            var getAllProcessing = [{}];
            callback();
        } else if (estimateView == 'addons') {
            // get all addons of corresponding level (assembly, subAssembly & part) from API
            var getAllAddons = [{}];
            callback();
        } else if (estimateView == 'extras') {
            // get all extras of corresponding level (assembly, subAssembly & part) from API
            var getAllEtras = [{}];
            callback();
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
        console.log('**** inside function_name of createOrEditEstimateService.js ****', this.formData.assembly.subAssemblies);

        callback();
    }



    



});