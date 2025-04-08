import Question from "./Question.js";
import { getAnswers } from "./utils.js";
import { nextButton, form, render } from "./ui.js";

function CheckboxQuestion(data) {
    Question.call(this, data);
    this.init = function () {
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
    };
}

export default CheckboxQuestion;
