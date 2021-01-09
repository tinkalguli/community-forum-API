const { Schema, model } = require("mongoose");

let answerSchema = new Schema({
    text : { type : String },
    author : { type : Schema.Types.ObjectId, ref : "User", required : true },
    questionId : { type : Schema.Types.ObjectId, ref : "Question", required : true }
}, { timestamps : true });

module.exports = model("Answer", answerSchema);