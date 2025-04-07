import { nextButton, form } from "./ui.js";

export let timerId;

export function splitStr(str) {
    const arr = str.split("#;");
    if (arr[arr.length - 1] === "") {
        arr.pop();
    }
    return arr.map((el) => el.replaceAll('"', "'"));
}

export function getAnswers(inputs) {
    const res = Array.from(inputs)
        .filter((input) => input.checked === true)
        .map((el) => el.value);
    return res;
}

export function setTimer(counter) {
    return new Promise((resolve) => {
        timerId = setInterval(() => {
            if (counter > 0) {
                counter--;
                changeCounter(counter);
            } else {
                removeTimer(timerId);
                removeCounter();
                resolve();
            }
        }, 1000);
    });
}

export function changeCounter(counter) {
    const timerEl = document.querySelector(".timer");
    if (timerEl) {
        timerEl.textContent = `Таймер: осталось ${counter} с.`;
    }
}
export function removeCounter() {
    const timerEl = document.querySelector(".timer");
    timerEl?.remove();
}

export function removeTimer(timerId) {
    clearInterval(timerId);
}

export function formErrorMessage(text) {
    const errorEl = document.createElement("p");
    errorEl.style.color = "red";
    errorEl.textContent = `${text}`;
    return errorEl;
}

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
