import { startButton, nextButton } from "./ui.js";
import TestController from "./TestController.js";

const testController = new TestController();

startButton.addEventListener("click", testController.init.bind(testController));
nextButton.addEventListener(
    "click",
    testController.createNextQuestionObject.bind(testController)
);
