import testService from "./testService.js";
import { testController, removeTimer } from "./testController.js";

const startButton = document.querySelector(".start");
const nextButton = document.querySelector(".next");
const textEl = document.querySelector(".text");
const form = document.querySelector(".form");

startButton.addEventListener("click", () => {
    testController.questionIndex = 0;
    textEl.style.color = "black";

    testService
        .testInit(testController.serviceUrl)
        .then((response) => {return response.json()})
        .then(() => testService.getNext(testController.serviceUrl, testController.questionIndex))
        .then((response) => response.json())
        .then((data) => testController.createNextQuestionObject(data))
        .then((question) => testController.init(question))
        .then((question) => {
            testController.addQuestionToList(question);
            testController.questionIndex++;
        })
        .catch((err) => {
            console.log(err);
            form.innerHTML = "";
            textEl.textContent = `${err}`;
        });
});

nextButton.addEventListener("click", () => {
    if (testController.questionIndex == 9) {
        testController.questionIndex++;
        testController.checkAnswers();
        form.innerHTML = "";
        textEl.textContent = `Опрос окончен. Ваши баллы: ${testController.totalScore}`;
        nextButton.disabled = true;
    } else {
        testService
            .getNext(testController.serviceUrl, testController.questionIndex)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => testController.createNextQuestionObject(data))
            .then((question) => testController.init(question))
            .then((question) => {
                testController.addQuestionToList(question);
                testController.questionIndex++;
            })
            .then(() => testController.checkAnswers())           
            .then(() => testController.totalScore)
            .catch((err) => {
                removeTimer();
                console.log(err);
                form.innerHTML = "";
                textEl.style.color = "red";
                textEl.textContent = `${err}`;
            });
    }
});


