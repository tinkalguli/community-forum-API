const {Schema, model, plugin} = require("mongoose");
const slug = require('mongoose-slug-updater');
const options = {
    separator: "_",
    lang: "en",
    truncate: 50,
    backwardCompatible: true//support for the old options names used in the mongoose-slug-generator
};
plugin(slug, options);

let questionSchema = new Schema({
    slug : { type : String, unique : true, slug: "title", slugPaddingSize: 4 },
    title : { type : String, required : true },
    description : { type : String},
    tags : [{ type : String }],
    answers : [{ type : Schema.Types.ObjectId, ref : "Answer" }],
    author : { type : Schema.Types.ObjectId, required : true, ref : "User" }
}, { timestamps : true });

module.exports = model("Question", questionSchema);