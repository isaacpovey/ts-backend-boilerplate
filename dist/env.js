"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const _ = require("lodash");
require('dotenv').config();
const referenceConfig = {
    PORT: 9000,
    PUBLIC_DOMAIN: 'http://localhost',
    NODE_ENV: 'development'
};
const mandatoryKeys = ['PORT', 'PUBLIC_DOMAIN'];
const prodMandatoryKeys = [];
const jsonKeys = [];
const tempEnv = { ...referenceConfig, ..._.pick(process.env, Object.keys(referenceConfig)) };
// Prefix PUBLIC_DOMAIN with https:// if no protocol defined.
if (!RegExp('^https?://').test(tempEnv.PUBLIC_DOMAIN)) {
    tempEnv.PUBLIC_DOMAIN = 'https://' + tempEnv.PUBLIC_DOMAIN;
}
Object.keys(tempEnv).forEach(k => {
    const key = k;
    if (typeof tempEnv[key] === 'string') {
        ;
        tempEnv[key] = tempEnv[key].trim();
    }
});
jsonKeys.forEach(k => {
    if (typeof tempEnv[k] === 'string') {
        try {
            ;
            tempEnv[k] = JSON.parse(tempEnv[k]);
        }
        catch (error) {
            throw new Error(`Environment variable - ${k} is not valid json`);
        }
    }
});
function throwUnsetError(key) {
    throw new Error(`Environment variable - ${key} is mandatory`);
}
// If mandatory keys are unset, just blow up
mandatoryKeys.forEach(key => (!tempEnv[key] ? throwUnsetError(key) : null));
if ('production' === tempEnv.NODE_ENV) {
    prodMandatoryKeys.forEach(key => (!tempEnv[key] ? throwUnsetError(key) : null));
}
exports.env = tempEnv;
