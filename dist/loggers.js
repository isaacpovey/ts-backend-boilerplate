"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = void 0;
const util = require("util");
exports.errorLogger = (logFunction) => (content) => {
    const time = new Date().toISOString();
    logFunction(util.inspect({ time, error: content }, { depth: 8 }));
};
