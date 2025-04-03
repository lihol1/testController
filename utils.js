import { testController } from './testController.js';
const nextButton = document.querySelector(".next");

export function splitStr(prop) {
    const arr = prop.split("#;");
    if (arr[arr.length - 1] === "") {
        arr.pop();
    }
    return arr.map((el) => el.replaceAll('"', "'"));
}

export function setTimer(counter, timerEl) {
    return (testController.timerId = setInterval(() => {
        if (counter > 0) {
            counter--;
            timerEl.textContent = `Таймер: осталось ${counter} с.`;
        } else {
            clearInterval(testController.timerId);
            timerEl.remove();
            nextButton.dispatchEvent(new MouseEvent("click"));
        }
    }, 1000));
}