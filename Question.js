function Question() {
    this.answers = "",
    this.options = [],
    this.score = 5,
    this.text = "",
    this.userAnswers = []
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