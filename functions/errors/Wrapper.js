"use strict";

const Errors = require('./Errors.js');

module.exports = {
    async handleWithRetry(fn, source, message, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                const result = await Errors.handle(source, error, message);
                if (Errors.isRetry(result)) continue;
                if (Errors.isStop(result)) return null;
                if (Errors.isSkip(result)) return null;
                if (i === maxRetries - 1) return null;
            }
        }
        return null;
    }
};