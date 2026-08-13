"use strict";
//yeah this was straight up stolen from LuckyTools location files 
module.exports = {
    "New York, US": { range: "74.67.0.0", isp: "Spectrum", ip: () => `74.67.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Los Angeles, US": { range: "76.88.0.0", isp: "Spectrum", ip: () => `76.88.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Chicago, US": { range: "68.50.0.0", isp: "Comcast", ip: () => `68.50.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Houston, US": { range: "72.184.0.0", isp: "AT&T", ip: () => `72.184.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Miami, US": { range: "98.156.0.0", isp: "Xfinity", ip: () => `98.156.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "London, UK": { range: "82.132.0.0", isp: "BT", ip: () => `82.132.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Manchester, UK": { range: "86.24.0.0", isp: "Virgin Media", ip: () => `86.24.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Berlin, DE": { range: "91.65.0.0", isp: "Deutsche Telekom", ip: () => `91.65.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Paris, FR": { range: "82.127.0.0", isp: "Orange", ip: () => `82.127.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Sydney, AU": { range: "124.176.0.0", isp: "Telstra", ip: () => `124.176.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Toronto, CA": { range: "99.238.0.0", isp: "Rogers", ip: () => `99.238.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Tokyo, JP": { range: "126.74.0.0", isp: "NTT", ip: () => `126.74.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Amsterdam, NL": { range: "77.168.0.0", isp: "KPN", ip: () => `77.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Stockholm, SE": { range: "81.232.0.0", isp: "Telia", ip: () => `81.232.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Mumbai, IN": { range: "103.87.0.0", isp: "Jio", ip: () => `103.87.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "São Paulo, BR": { range: "177.68.0.0", isp: "Vivo", ip: () => `177.68.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Moscow, RU": { range: "95.29.0.0", isp: "Rostelecom", ip: () => `95.29.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Dubai, AE": { range: "86.98.0.0", isp: "Etisalat", ip: () => `86.98.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Singapore, SG": { range: "119.74.0.0", isp: "Singtel", ip: () => `119.74.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    "Seoul, KR": { range: "121.166.0.0", isp: "KT", ip: () => `121.166.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` }
};