import { nextButton, textEl, form, index } from "./ui.js";
import RadioQuestion from "./RadioQuestion.js";
import CheckboxQuestion from "./CheckboxQuestion.js";
import {
    splitStr,
    timerId,
    removeTimer,
    removeCounter,
    formErrorMessage,
} from "./utils.js";

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
        this.ajaxToService(`${this.serviceUrl}/TestInit`).then((data) =>
            this.createNextQuestionObject(data)
        );
    },
    ajaxToService: async function (url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.statusText}`);
            }
            return response.json();
        } catch (err) {
            if (timerId) {
                removeTimer(timerId);
                removeCounter();
            }
            form.innerHTML = "";
            textEl.innerHTML = "";
            form.append(formErrorMessage(err));
        }
    },
    loadQuestion: function () {
        return this.ajaxToService(
            `${this.serviceUrl}/GetNext/${this.questionIndex}`
        );
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
    createNextQuestionObject: function () {
        if (this.questionIndex == 10) {
            if (timerId) {
                removeTimer(timerId);
                removeCounter();
            }
            this.checkAnswers();
            form.innerHTML = "";
            index.innerHTML = "";
            textEl.textContent = `Опрос окончен. Ваши баллы: ${this.totalScore}`;
            nextButton.disabled = true;
        } else {
            this.loadQuestion().then((questionData) => {
                if (questionData) {
                    questionData.options = splitStr(questionData.options);
                    questionData.answers = splitStr(questionData.answers);

                    let currentQuestion = this.questionFactory(
                        questionData.answers.length,
                        questionData
                    );
                    this.showResult(currentQuestion);
                    this.addQuestionToList(currentQuestion);
                    this.questionIndex++;
                    if (this.questionIndex > 1) {
                        this.checkAnswers();
                        this.totalScore;
                    }
                }
            });
        }
    },
    questionFactory: function (length, data) {
        if (length > 1) return new CheckboxQuestion(data);
        return new RadioQuestion(data);
    },
    showResult: function (question) {
        form.innerHTML = "";
        textEl.textContent = question.text;
        index.textContent = `${this.questionIndex + 1}/10`;
        question.init();
        nextButton.disabled = true;
    },
};

export default TestController;
