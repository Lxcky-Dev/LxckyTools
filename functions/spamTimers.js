"use strict";
//simple timer map 
const timers = new Map();

module.exports = {
    get(userId) { return timers.get(userId); },
    set(userId, data) { timers.set(userId, data); },
    delete(userId) { timers.delete(userId); }
};