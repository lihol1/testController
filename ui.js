import { removeTimer, removeCounter, timerId, setTimer } from "./utils.js";

export const startButton = document.querySelector(".questionBlock__start");
export const nextButton = document.querySelector(".questionBlock__next");
export const textEl = document.querySelector(".questionBlock__text");
export const form = document.querySelector(".questionBlock__form");
export const index = document.querySelector(".questionBlock__index");

export function render(obj) {
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
    }
}
