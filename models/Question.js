const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const options = { separator: "_", lang: "en", truncate: 50 };
mongoose.plugin(slug, options);

let questionSchema = new Schema({
    slug : { type : String, unique : true, slug: "title", slug_padding_size: 4 },
    title : { type : String, required : true },
    description : { type : String, minlength : 10 },
    tags : [{ type : String }],
    answers : [{ type : Schema.Types.ObjectId, ref : "Answer" }],
    author : { type : Schema.Types.ObjectId, required : true, ref : "User" }
}, { timestamps : true });

module.exports = mongoose.model("Question", questionSchema);