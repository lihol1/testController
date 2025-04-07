import { startButton, nextButton } from "./ui.js";
import { testInit, getNext } from "./controller.js";

startButton.addEventListener("click", testInit);
nextButton.addEventListener("click", getNext);
