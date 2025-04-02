import testService from "./testService.js";
import { testController, removeTimer } from "./testController.js";

const startButton = document.querySelector("#start");
const nextButton = document.querySelector("#next");
const textEl = document.querySelector(".text");
const form = document.querySelector(".form");

startButton.addEventListener("click", () => {
    testController.questionIndex = 0;
    textEl.style.color = "black";

    testService
        .testInit()
        .then((res) => {
            if (!res.ok) {
                throw new Error(`${res.statusText}`);
            }
            return res.json();
        })
        .then((res) => testService.getNext())
        .then((res) => res.json())
        .then((res) => testController.createNextQuestionObject(res))
        .then((res) => testController.init(res))
        .then((res) => {
            testController.addQuestionToList(res);
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
        testController.showResult();
        form.innerHTML = "";
        textEl.textContent = `Опрос окончен. Ваши баллы: ${testController.showResult()}`;
        nextButton.disabled = true;
    } else {
        testService
            .getNext()
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`${res.statusText}`);
                }
                return res.json();
            })
            .then((res) => testController.createNextQuestionObject(res))
            .then((res) => testController.init(res))
            .then((res) => {
                testController.addQuestionToList(res);
                testController.questionIndex++;
            })
            .then(() => testController.checkAnswers())
            .then(() => testController.showResult())
            .catch((err) => {
                removeTimer();
                console.log(err);
                form.innerHTML = "";
                textEl.style.color = "red";
                textEl.textContent = `${err}`;
            });
    }
});

// prevButton.addEventListener("click", () => {
//     testController.questionIndex--;
//     console.log(testController.questionIndex)

//         // console.log(res);
//     const obj = testController.questionList[testController.questionIndex-1]
//     Promise.resolve(testController.createNextQuestionObject(obj))
//     .then((res)=>{
//         console.log(res)
//         return testController.init(res)
//     })
//     .then(()=>{
//         // console.log(testController.checkAnswers())
//         // testController.checkAnswers()
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// });
