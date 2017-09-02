var schema = new Schema({
    shapeName: {},
    type: {
        type: String,
        enum: ["2d", "3d"],
        default: "2d"
    },
    icon: {
        Type:String
    },
    image: {
        Type:String
    },
    variable:[{}],
    partFormulae: {
        perimeter: String,
        sheetMetalArea: String,
        surfaceArea: String,
        weight: String,
    },
    namingConvenstion: {}
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MShape', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);