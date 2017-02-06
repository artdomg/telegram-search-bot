'use strict';

var search = require('./search');

module.exports = {
	init: (bot, options) => {
		if(!options) {
			options = {};
		}

		var states = {};

		var name = options.botName;

		bot.onText(/\/search (.+)/, (msg, match) => {
			var chatId = msg.chat.id;

			searchText(match[1], msg);
		});

		var regex = new RegExp(`/search@${name}$`);
		bot.onText(/\/search$/, initSearch);
		bot.onText(regex, initSearch);

		bot.on('message', (msg) => {
			if(getState(msg)) {
				deleteState(msg);
				searchText(msg.text, msg);
			}
		});

		function initSearch(msg, match) {
			var chatId = msg.chat.id;
			setState(true, msg);
			bot.sendMessage(chatId, 'What do you want to search?');
		}

		function searchText(text, msg) {
			var chatId = msg.chat.id;

			search(text, { lang: options.lang })
			.then((data) => {
				if(!data.result && !data.image) {
					return bot.sendMessage(chatId, 'Could not find anything.');
				}

				if(data.result) {
					bot.sendMessage(chatId, data.result);
				}

				if(data.image) {
					bot.sendPhoto(chatId, data.image);
				}
			})
			.catch(() => bot.sendMessage(chatId, 'Oops. There was an error. Try again later'));
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
