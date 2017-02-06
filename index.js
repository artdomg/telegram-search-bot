'use strict';

var TelegramBot = require('node-telegram-bot-api');

var token = process.env.TOKEN || '';
var lang = process.env.LANG;

var telegramBot = new TelegramBot(token, { polling: true });

var searchBot = require('./bot');
searchBot.init(telegramBot, {
	lang: lang
});

console.log('Search bot started');
