"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosInstance = void 0;
const http = require("http");
const https = require("https");
const axios_1 = require("axios");
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
exports.axiosInstance = axios_1.default.create({
    httpAgent,
    httpsAgent,
    timeout: 10000
});
