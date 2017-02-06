'use strict';

var TelegramBot = require('node-telegram-bot-api');

var token = process.env.TOKEN;
var lang = process.env.LANG;
var botName = process.env.NAME;

if(!token || ! botName) {
	throw 'TOKEN and NAME environment variables are required!';
}

var telegramBot = new TelegramBot(token, { polling: true });

var searchBot = require('./bot');
searchBot.init(telegramBot, {
	lang: lang,
	botName: botName
});

console.log('Search bot started');
