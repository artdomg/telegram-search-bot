'use strict';

var search = require('./search');
var stateManager = require('./stateManager');

module.exports = function(bot, options) {
	if(!options) {
		options = {};
	}

	var name = options.botName;

	return {
		searchInline: (msg, match) => {
			var chatId = msg.chat.id;

			searchText(match[1], msg);
		},
		initSearch: (msg, match) => {
			var chatId = msg.chat.id;
			stateManager.setState(true, msg);
			bot.sendMessage(chatId, 'What do you want to search?');
		},
		search: (msg) => {
			if(stateManager.getState(msg)) {
				stateManager.deleteState(msg);
				searchText(msg.text, msg);
			}
		}
	};

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
};
