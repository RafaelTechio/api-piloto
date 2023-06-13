const { default: axios } = require('axios');

module.exports = class IaConnection {
    constructor(baseurl) {
        this.baseUrl = baseurl;
        this.axios = axios.create({
            baseURL: this.baseUrl,
        });
    }

    async postTrain(data) {
        return await this.axios.request({
            url: '/train',
            method: 'post',
            data,
        });
    }

    async postPredict(data) {
        return await this.axios.request({
            url: '/test',
            method: 'post',
            data,
        });
    }
};
