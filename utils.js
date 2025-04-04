export let timerId;

export function splitStr(str) {
    const arr = str.split("#;");
    if (arr[arr.length - 1] === "") {
        arr.pop();
    }
    return arr.map((el) => el.replaceAll('"', "'"));
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
    timerEl.textContent = `Таймер: осталось ${counter} с.`;
}
export function removeCounter() {
    const timerEl = document.querySelector(".timer");
    timerEl?.remove();
}
export function removeTimer(timerId) {
    clearInterval(timerId);
}

export function formErrorMessage (text){
    const errorEl = document.createElement('p')
    errorEl.style.color = "red";
    errorEl.textContent = `${text}`;    
    return errorEl;
}
