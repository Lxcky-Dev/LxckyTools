"use strict";

const { EmbedBuilder } = require('discord.js');
//nitro image found on chrome as yankis didnt work
//also componetnt builder didnt work for FakeNitro so changed to embed
const NITRO_IMAGE = 'https://images.ctfassets.net/w5r1fvmogo3f/6bNn3eGf9awy773QlIE4hh/5e12fdb892203f5bc6a899e2dcf05380/Discord_Nitro_2560x1440_withlogo.jpg?fm=webp&q=90&fit=scale&w=1920';

module.exports = {
    primary(title, description) {
        return new EmbedBuilder().setTitle(title).setDescription(description || '').setColor(0x2D1B4E);
    },
    success(title, description) {
        return new EmbedBuilder().setTitle(title).setDescription(description || '').setColor(0x2D1B4E);
    },
    error(title, description) {
        return new EmbedBuilder().setTitle(title).setDescription(description || '').setColor(0xF87171);
    },
    warning(title, description) {
        return new EmbedBuilder().setTitle(title).setDescription(description || '').setColor(0xFACC15);
    },
    nitroGift(sender) {
        return new EmbedBuilder()
            .setTitle("You've been gifted a subscription!")
            .setDescription(`**${sender}** has gifted you Nitro for **1 month!**\n\n-# Expires in 48 hours`)
            .setColor(0xB57BEE)
            .setImage(NITRO_IMAGE);
    }
};