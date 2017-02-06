'use strict';

var rp = require('request-promise');

module.exports = {
	init: (bot, options) => {
		if(!options) {
			options = {};
		}
		
		var lang = options.lang || 'es-MX';

		bot.onText(/\/search (.+)/, (msg, match) => {
			var chatId = msg.chat.id;

			var options = {
				uri: `http://api.duckduckgo.com/?q=${match[1]}&format=json`,
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
		});
	}
};
