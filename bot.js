'use strict';

var rp = require('request-promise');

module.exports = {
	init: (bot, options) => {
		if(!options) {
			options = {};
		}

		var states = {};

		var lang = options.lang || 'es-MX';
		var name = options.botName;

		bot.onText(/\/search (.+)/, (msg, match) => {
			var chatId = msg.chat.id;

			search(match[1], msg);
		});

		var regex = new RegExp(`/search@${name}$`);
		bot.onText(/\/search$/, initSearch);
		bot.onText(regex, initSearch);

		bot.on('message', (msg) => {
			if(getState(msg)) {
				deleteState(msg);
				search(msg.text, msg);
			}
		});

		function initSearch(msg, match) {
			var chatId = msg.chat.id;
			setState(true, msg);
			bot.sendMessage(chatId, 'What do you want to search?');
		}

		function search(text, msg) {
			var chatId = msg.chat.id;

			var options = {
				uri: `http://api.duckduckgo.com/?q=${text}&format=json`,
				json: true,
				headers: {
					'Accept-Language': lang
				}
			};

			return rp(options)
			.then((data) => {
				if(!data.AbstractText && !data.Image) {
					return bot.sendMessage(chatId, 'Could not find anything.');
				}

				if(data.AbstractText) {
					bot.sendMessage(chatId, data.AbstractText);
				}

				if(data.Image) {
					bot.sendPhoto(chatId, data.Image);
				}
			})
			.catch((error) => bot.sendMessage(chatId, 'Oops. There was an error. Try again later'));
		}

		function getState(msg) {
			return states[getId(msg)];
		}

		function setState(val, msg) {
			states[getId(msg)] = val;
		}

		function deleteState(msg) {
			delete states[getId(msg)];
		}

		function getId(msg) {
			return `${msg.from.id}-${msg.chat.id}`;
		}
	}
};
