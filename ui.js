import testService from "./testService.js";
import { testController } from "./testController.js";
import {
    removeTimer,
    removeCounter,
    timerId,
    formErrorMessage,
} from "./utils.js";

const startButton = document.querySelector(".questionBlock__start");
const nextButton = document.querySelector(".questionBlock__next");
const textEl = document.querySelector(".questionBlock__text");
const form = document.querySelector(".questionBlock__form");

startButton.addEventListener("click", () => {
    testController.questionIndex = 0;
    textEl.style.color = "black";

    testService
        .testInit(testController.serviceUrl)
        .then((response) => {
            return response.json();
        })
        .then(() =>
            testService.getNext(
                testController.serviceUrl,
                testController.questionIndex
            )
        )
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
            textEl.textContent = "";
            form.append(formErrorMessage(err));
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
                removeTimer(timerId);
                removeCounter();
                console.log(err);
                form.innerHTML = "";
                textEl.innerHTML = "";
                form.append(formErrorMessage(err));
            });
    }
});
