const express = require("express");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const router = express.Router();
const { verifyToken, verifyTokenOptional } = require("../modules/token");
const { verifyUserAccess } = require("../middlewares/auth");

// create question
router.post("/", verifyToken, async (req, res, next) => {
    try {
        let author = req.user.id;
        req.body.question.author = author;
        let question = await (await Question.create(req.body.question))
            .populate("author", "id username").populate("answers");
        res.status(201).json({ question : questionInfo(question)});
    } catch (error) {
        next(error);
    }
});

// Get all questions
router.get("/", verifyTokenOptional, async (req, res, next) => {
    try {
        let questions = await Question.find({})
            .populate("author", "id username").populate("answers");
        res.status(200).json(
            { questions : questions.map(question => questionInfo(question))});
    } catch (error) {
        next(error);
    }
});

// update question
router.put("/:questionId", verifyToken, async (req, res, next) => {
    try {
        let questionId = req.params.questionId;
        let currentQuestion = await Question.findById(questionId);
        verifyUserAccess(currentQuestion.author, req.user.id, res);
        let question = await Question.findByIdAndUpdate( questionId, req.body.question, { new : true })
            .populate("author", "id username").populate("answers");
        res.status(200).json({ question : questionInfo(question)});
    } catch (error) {
        next(error);
    }
});

// delete question
router.delete("/:slug", verifyToken, async (req, res, next) => {
    try {
        let slug = req.params.slug;
        let currentQuestion = await Question.findOne({ slug });
        verifyUserAccess(currentQuestion.author, req.user.id, res);
        let question = await Question.findOneAndDelete( { slug });
        await Answer.deleteMany({ questionId : question.id });
        res.status(200).json({ question : "Question has been deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// add answers for question
router.put("/:questionId/answers", verifyToken, async (req, res, next) => {
    try {
        let questionId = req.params.questionId;
        let answer = await (await Answer.create(req.body.answer))
        .execPopulate("author", "id username");
        await Question.findByIdAndUpdate(questionId, { $addToSet : { answers : answer.id }});
        res.status(200).json({ answer : answerInfo(answer) });
    } catch (error) {
        next(error);
    }
});

function questionInfo(question) {
    return {
        slug : question.slug,
        title : question.title,
        description : question.description,
        tags : question.tags,
        answers : question.answers,
        author : question.author
    }
}

function answerInfo(answer) {
    return {
        text : answer.text,
        author : answer.author
    }
}

module.exports = router;