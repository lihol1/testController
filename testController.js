const nextButton = document.querySelector(".questionBlock__next");
const textEl = document.querySelector(".questionBlock__text");
const form = document.querySelector(".questionBlock__form");

import {
    setTimer,
    splitStr,
    removeTimer,
    removeCounter,
    timerId,
} from "./utils.js";

function TestController() {
    this.totalScore = 0;
    this.questionIndex = 0;
    this.questionList = [];
    this.questionCount = 0;
    this.serviceUrl = "http://localhost:8089/api/Test";   
}

TestController.prototype = {
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
        console.log(this.totalScore)
        console.log(this.questionList[this.questionIndex - 2].score)
        this.totalScore += this.questionList[this.questionIndex - 2].score;
        console.log(this.totalScore)
        return true;
    },
    createNextQuestionObject: function (questionData) {
        const optionsArr = splitStr(questionData.options);
        const answersArr = splitStr(questionData.answers);

        let currentQuestion = this.questionFactory(answersArr.length);

        currentQuestion = Object.assign(currentQuestion, {
            ...questionData,
            options: optionsArr,
            answers: answersArr,
        });
        return currentQuestion;
    },
    init: function (question) {
        form.innerHTML = "";
        textEl.textContent = question.text;
        question.init();
        nextButton.disabled = true;
        return question;
    },
    questionFactory: function (length) {
        if (length > 1) return new CheckboxQuestion();
        return new RadioQuestion();
    },
};

export const testController = new TestController();

function Question() {
    this.answers = "",
    this.options = [],
    this.score = 5,
    this.text = "",
    this.userAnswers = [];
}
Question.prototype = {
    getScore: () => {
        return this.score;
    },
    handleNext: () => {
        testController.questionIndex++;
    },
};

function RadioQuestion() {
    Question.call(this);
    this.init = function () {   
        render(this);
        const radioInputs = form.querySelectorAll('input[type="radio"]');
        radioInputs.forEach((input) => {
            input.addEventListener("change", () => {
                this.userAnswers = getAnswers(radioInputs);
                if (!this.userAnswers.length < 1) nextButton.disabled = false;
            });
        });
    };
   
};

function CheckboxQuestion() {
    Question.call(this);
    this.init = function () {
        render(this);
    
        const checkboxInputs = form.querySelectorAll('input[type="checkbox"]');
        checkboxInputs.forEach((input) => {
            input.addEventListener("change", () => {
                this.userAnswers = getAnswers(checkboxInputs);
                if (this.userAnswers.length < 1) {
                    nextButton.disabled = true;
                } else {
                    nextButton.disabled = false;
                }
            });
        });
    };
}


function getAnswers(inputs) {
    const res = Array.from(inputs)
        .filter((input) => input.checked === true)
        .map((el) => el.value);
    return res;
}

function render(obj) {
    removeTimer(timerId);
    removeCounter();
    const optionsCount = obj.options.length;
    let optionHTML = "";
    for (let i = 0; i < optionsCount; i++) {
        let innerHTML;
        if (obj.answers.length > 1) {
            innerHTML = `<div>
                <input type="checkbox" id="${"option" + i}" name="${
                "option" + i
            }" value=\"${obj.options[i]}\"  />
                <label for="${"option" + i}">${obj.options[i]}</label>
            </div>`;
        } else {
            innerHTML = `<div>
                <input type="radio" id="${"option" + i}" name="${
                "option" + obj.id
            }" value=\"${obj.options[i]}\"   />
                <label for="${"option" + i}">${obj.options[i]}</label>
            </div>`;
        }
        optionHTML += innerHTML;
    }
    form.innerHTML = optionHTML;

    if (obj.timeout > 0) {
        const timerEl = document.createElement("p");
        timerEl.classList.add("timer");
        form.insertAdjacentElement("afterend", timerEl);
        timerEl.textContent = `Таймер: осталось ${obj.timeout} с.`;

        setTimer(obj.timeout).then(() => {
            nextButton.dispatchEvent(new MouseEvent("click"));
        });
        // setTimer(obj.timeout, () => {}, () =>{});
    }
}

