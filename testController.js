const nextButton = document.querySelector(".next");
const textEl = document.querySelector(".text");
const form = document.querySelector(".form");

import { setTimer, splitStr } from './utils.js';

function TestController() {};

TestController.prototype ={
    totalScore: 0,
    questionIndex: 0,
    questionList : [],
    questionCount : 0,
    serviceUrl : "http://localhost:8089/api/Test",
    timerId: null,
    addQuestionToList : function (question) {
        this.questionList.push(question);
        this.questionCount++;
    },
    checkAnswers : function () {        
        const { answers, userAnswers } = this.questionList[this.questionIndex - 2]

        if (answers.length !== userAnswers.length) return false;
        for (let elem of userAnswers) {
            if (!answers.includes(elem)) return false;
        }
        this.totalScore += this.questionList[this.questionIndex - 2].score;
        return true;
    },
    createNextQuestionObject : function (questionData) {        
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
    init : function (question) {     
        form.innerHTML = "";
        textEl.textContent = question.text;
        question.init();
        nextButton.disabled = true;
        return question;
    },
    questionFactory: function (length) {   
        if (length > 1) return new CheckboxQuestion;
        return new RadioQuestion;
    } 
}

export const testController = new TestController();

function Question () {};
Question.prototype ={
    answers: "",
    options: [],
    score : 5,
    text : "",
    userAnswers : [],
    getScore : ()=> {
        return this.score;
    },
    handleNext : ()=>{
        testController.questionIndex++;
    }
}

function RadioQuestion(){};
RadioQuestion.prototype = Object.create(Question.prototype)
RadioQuestion.prototype.init = function() {
    render(this);

    const radioInputs = form.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((input) => {
        input.addEventListener("change", () => {            
            function getAnswers(inputs) {
                const res = Array.from(inputs)
                    .filter((input) => input.checked === true)
                    .map((el) => el.value);
                return res;
            }            
            this.userAnswers = getAnswers(radioInputs);        
            if (!this.userAnswers.length < 1) nextButton.disabled = false;
        });
    });
}

function CheckboxQuestion(){};
CheckboxQuestion.prototype = Question.prototype;
CheckboxQuestion.prototype.init = function() {
    render(this);

    const checkboxInputs = form.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach((input) => {
        input.addEventListener("change", () => {            
            function getAnswers(inputs) {
                const res = Array.from(inputs)
                    .filter((input) => input.checked === true)
                    .map((el) => el.value);
                return res;
            }
            this.userAnswers = getAnswers(checkboxInputs);
            if (this.userAnswers.length < 1) {
                nextButton.disabled = true;
            } else {
                nextButton.disabled = false;
            }
        });
    });
};

export function removeTimer() {
    if (testController.timerId) {
        clearInterval(testController.timerId);
        const timerEl = document.querySelector(".timer");
        timerEl?.remove();
    }
}
function render(obj) {    
    removeTimer();
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
        setTimer(obj.timeout, timerEl);
    }
}
