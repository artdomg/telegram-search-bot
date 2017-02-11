'use strict';

var TelegramBot = require('node-telegram-bot-api');

var token = process.env.TOKEN;
var lang = process.env.LANG;
var botName = process.env.NAME;

if(!token || ! botName) {
	throw 'TOKEN and NAME environment variables are required!';
}

var telegramBot = new TelegramBot(token, { polling: true });

var searchBot = require('./botEvents');
searchBot.init(telegramBot, {
	lang: lang,
	name: botName
});

console.log('Search bot started');

var app = require('express')();
app.get('/', (req, res) => res.send('Running!'));
app.listen(process.env.PORT || 3000);
