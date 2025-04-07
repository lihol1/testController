import Question from './Question.js';
import { render, getAnswers } from './utils.js';
import { nextButton, form} from './ui.js';

function RadioQuestion() {
    Question.call(this);
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