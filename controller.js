import TestController from "./TestController.js";
import { form, textEl, nextButton } from "./ui.js";
import { removeTimer, removeCounter, formErrorMessage, timerId } from "./utils.js";

const testController = new TestController();

export function testInit() {    
    testController
        .init()        
        .then(() => {
            return testController.loadQuestion();
        })        
        .then((data) => testController.createNextQuestionObject(data))
        .then((question) => testController.showResult(question))
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
}

export function getNext() {
    if (testController.questionIndex == 10) {
        testController.questionIndex++;
        testController.checkAnswers();
        form.innerHTML = "";
        textEl.textContent = `Опрос окончен. Ваши баллы: ${testController.totalScore}`;
        nextButton.disabled = true;
    } else {
        testController
            .loadQuestion()
            .then((data) => testController.createNextQuestionObject(data))
            .then((question) => testController.showResult(question))
            .then((question) => {
                testController.addQuestionToList(question);
                testController.questionIndex++;
            })
            .then(() => testController.checkAnswers())
            .then(() => testController.totalScore)
            .catch((err) => {
                if (timerId) {
                    removeTimer(timerId);
                    removeCounter();
                }
                console.log(err);
                form.innerHTML = "";
                textEl.innerHTML = "";
                form.append(formErrorMessage(err));
            });
    }
}


