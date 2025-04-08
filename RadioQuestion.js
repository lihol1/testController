import Question from "./Question.js";
import { getAnswers } from "./utils.js";
import { nextButton, form, render } from "./ui.js";

function RadioQuestion(data) {
    Question.call(this, data);
    this.init = function () {
        render(this);
        const radioInputs = form.querySelectorAll('input[type="radio"]');
        radioInputs.forEach((input) => {
            input.addEventListener("change", () => {
                this.userAnswers = getAnswers(radioInputs);
                if (!this.userAnswers.length < 1) nextButton.disabled = false;
            });
        });
    };
}
export default RadioQuestion;
