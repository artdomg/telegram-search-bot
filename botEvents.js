'use strict';

var botModule = require('./bot');

module.exports = {
	init: (bot, options) => {
		var botController = botModule(bot, options);

		bot.onText(/\/search (.+)/, botController.searchInline);

		bot.onText(/\/search$/, botController.initSearch);

		var regex = new RegExp(`/search@${options.name}$`);
		bot.onText(regex, botController.initSearch);

		bot.on('message', botController.search);
	}
};
