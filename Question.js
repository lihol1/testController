export function Question(data) {
    this.answers = data.answers,
    this.options = data.options,
    this.score = 5,
    this.text = data.text,
    this.userAnswers = [],
    this.timeout = data.timeout;
}
Question.prototype = {
    getScore: () => {
        return this.score;
    },
    handleNext: () => {
        testController.questionIndex++;
    },
};
export default Question;
