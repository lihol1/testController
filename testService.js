import { testController } from "./testController.js";
const testService = {
    testInit() {      
        return fetch("http://localhost:8089/api/Test/TestInit");       
    },

    getNext() {
           const index = testController.questionIndex
           return fetch(`http://localhost:8089/api/Test/GetNext/${index}`)       
    },
};

export default testService;
