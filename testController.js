import { nextButton, textEl, form, index } from "./ui.js";
import RadioQuestion from "./RadioQuestion.js";
import CheckboxQuestion from "./CheckboxQuestion.js";
import { splitStr } from "./utils.js";

function TestController() {
    this.totalScore = 0;
    this.questionIndex = 0;
    this.questionList = [];
    this.questionCount = 0;
    this.serviceUrl = "http://localhost:8089/api/Test";
}

TestController.prototype = {
    init: function () {
        this.questionIndex = 0;
        textEl.style.color = "black";
        return new Promise((resolve) => {
            resolve(this.ajaxToService(`${this.serviceUrl}/TestInit`));
        });
    },
    ajaxToService: async function (url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }
        return response.json();
    },
    loadQuestion: async function () {
        const data = await this.ajaxToService(
            `${this.serviceUrl}/GetNext/${this.questionIndex}`
        );
        return data;
    },
    addQuestionToList: function (question) {
        this.questionList.push(question);
        this.questionCount++;
    },
    checkAnswers: function () {
        const { answers, userAnswers } =
            this.questionList[this.questionIndex - 2];

        if (!answers || !userAnswers) return;
        if (answers.length !== userAnswers.length) return false;
        for (let elem of userAnswers) {
            if (!answers.includes(elem)) return false;
        }
        this.totalScore += this.questionList[this.questionIndex - 2].score;
        return true;
    },
    createNextQuestionObject: function (questionData) {
        if (questionData) {
            const optionsArr = splitStr(questionData.options);
            const answersArr = splitStr(questionData.answers);

            let currentQuestion = this.questionFactory(answersArr.length);

            currentQuestion = Object.assign(currentQuestion, {
                ...questionData,
                options: optionsArr,
                answers: answersArr,
            });
            return currentQuestion;
        }
    },
    questionFactory: function (length) {
        if (length > 1) return new CheckboxQuestion();
        return new RadioQuestion();
    },
    showResult: function (question) {
        form.innerHTML = "";
        textEl.textContent = question.text;
        console.log(index)
        index.textContent = `${this.questionIndex + 1}/10`
        question.init();
        nextButton.disabled = true;
        return question;
    },
};

export default TestController;
