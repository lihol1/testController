const startButton = document.querySelector("#start");
const nextButton = document.querySelector("#next");
const questionField = document.querySelector(".question");
const textEl = document.querySelector(".text");
const answerEl = document.querySelector(".answer");
const questionBlock = document.querySelector(".questionBlock");
const form = document.querySelector(".form");

let timerId;
export const testController = new TestController();

function TestController() {
    this.totalScore = 0;
    this.questionCount = 0;
    this.questionIndex = 0;
    this.questionList = [];
    (this.serviceUrl = "http://localhost:8089/api/Test/"),
        (this.showResult = function () {
            return this.totalScore;
        });
    this.addQuestionToList = function (question) {
        this.questionList.push(question);
        this.questionCount++;
    };
    this.checkAnswers = function () {
        const answers = this.questionList[this.questionIndex - 2].answers;
        let userAnswers = this.questionList[this.questionIndex - 2].userAnswers;

        if (answers.length !== userAnswers.length) return false;
        for (let elem of userAnswers) {
            if (!answers.includes(elem)) return false;
        }
        this.totalScore += this.questionList[this.questionIndex - 2].score;
        return true;
    };

    this.createNextQuestionObject = function (obj) {
        const optionsArr = splitStr(obj.options);
        const answersArr = splitStr(obj.answers);

        let currentQuestion = this.questionFactory(answersArr.length);

        currentQuestion = Object.assign(currentQuestion, {
            ...obj,
            options: optionsArr,
            answers: answersArr,
        });
        return currentQuestion;
    };

    this.init = function (question) {
        form.innerHTML = "";
        textEl.textContent = question.text;
        question.init();
        nextButton.disabled = true;
        return question;
    };
    this.questionFactory = function (length) {
        if (length > 1) return Object.create(checkboxQuestion);
        return Object.create(radioQuestion);
    };
}

const question = {
    answers: "",
    options: [],
    score: 5,
    text: "",
    userAnswers: [],
    getScore() {
        return this.score;
    },
    handleNext() {
        testController.questionIndex++;
    },
};

const radioQuestion = {
    init() {
        render(this);

        const radioInputs = form.querySelectorAll('input[type="radio"]');
        radioInputs.forEach((input) => {
            input.addEventListener("change", () => {
                this.userAnswers = getAnswers(radioInputs);  
                if (!this.userAnswers.length < 1) nextButton.disabled = false;
            });
        });
    },
    handleNext() {
        super.handleNext();
    },
};

const checkboxQuestion = {
    init() {
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
    },
    handleNext() {
        super.handleNext();
    },
};

Object.setPrototypeOf(radioQuestion, question);
Object.setPrototypeOf(checkboxQuestion, question);

function splitStr(prop) {
    const arr = prop.split("#;");
    if (arr[arr.length - 1] === "") {
        arr.pop();
    }
    return arr.map((el) => el.replaceAll('"', "'"));
}

function getAnswers(inputs) {
    const res = Array.from(inputs)
        .filter((input) => input.checked === true)
        .map((el) => el.value);
    return res;
}

function setTimer(counter, timerEl) {
    return (timerId = setInterval(() => {
        if (counter > 0) {
            counter--;
            timerEl.textContent = `Таймер: осталось ${counter} с.`;
        } else {
            clearInterval(timerId);
            timerEl.remove();
            nextButton.dispatchEvent(new MouseEvent("click"));
        }
    }, 1000));
}

export function removeTimer() {
    if (timerId) {
        clearInterval(timerId);
        const timerEl = document.querySelector(".timer");
        timerEl?.remove();
    }
}
function render(obj) {
    removeTimer();
    const length = obj.options.length;
    let optionHTML = "";
    for (let i = 0; i < length; i++) {
        let innerHTML;
        if (obj.answers.length > 1) {
            // для checkbox
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
