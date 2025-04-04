const testService = {
    testInit(url) {
        return fetch(`${url}/TestInit`);
    },

    getNext(url, index) {
        return fetch(`${url}/GetNext/${index}`);
    },
};

export default testService;
