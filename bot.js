'use strict';

var search = require('./search');
var stateManager = require('./stateManager');

module.exports = function(bot, options) {
	if(!options) {
		options = {};
	}

	var name = options.botName;

	var commands = {
		'MercadoLibre': function(text, chatId) {
			return search.mercadolibreSearch(text)
			.then((data) => {
				if(data.results.length === 0) {
					return bot.sendMessage(chatId, 'Could not find anything');
				}

				var article = data.results[0];

				bot.sendMessage(chatId, `${article.title} - ${article.price} ${article.currency_id} - ${article.permalink}`);

				return data;
			});
		},
		'DuckDuckGo': function(text, chatId) {
			return search.generalSearch(text, { lang: options.lang })
			.then((data) => {
				if(!data.result && !data.image) {
					return bot.sendMessage(chatId, 'Could not find anything.');
				}

				if(data.result) bot.sendMessage(chatId, data.result);
				if(data.image) bot.sendPhoto(chatId, data.image);

				return data;
			});
		}
	};

	return {
		searchInline: (msg, match) => {
			var chatId = msg.chat.id;

			stateManager.setState({
				status: 2,
				command: 'DuckDuckGo'
			}, msg);

			searchText(match[1], msg);
		},
		initSearch: (msg, match) => {
			var chatId = msg.chat.id;
			stateManager.setState({
				status: 1
			}, msg);
			bot.sendMessage(chatId, 'Where do you want to search?', {
				reply_to_message_id: msg.message_id,
				reply_markup: {
					keyboard: [
						[
							{ text: 'MercadoLibre' },
							{ text: 'DuckDuckGo' }
						]
					],
					force_reply: true,
					selective: true
				}
			});
		},
		search: (msg) => {
			var chatId = msg.chat.id;
			var state = stateManager.getState(msg);

			if(state) {
				if(state.status === 1) {
					if(commands[msg.text]) {
						state.status = 2;
						state.command = msg.text;
						bot.sendMessage(chatId, 'What do you want to search?', {
							reply_to_message_id: msg.message_id,
							reply_markup: {
								force_reply: true,
								selective: true
							}
						});
					} else {
						stateManager.deleteState(msg);
					}
				} else if(state.status === 2) {
					searchText(msg.text, msg);
				}
			}
		}
	};

	function searchText(text, msg) {
		var chatId = msg.chat.id;
		var state = stateManager.getState(msg);

		if(state) {
			stateManager.deleteState(msg);

			commands[state.command](text, chatId)
			.catch(() => bot.sendMessage(chatId, 'Oops. There was an error. Try again later'));
		}
	}
};
