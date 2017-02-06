'use strict';

var rp = require('request-promise');

module.exports = function (text, options) {
	if(!options) options = {};
	if(!options.lang) options.lang = 'es-MX';

	var reqOptions = {
		uri: `http://api.duckduckgo.com/?q=${text}&format=json`,
		json: true,
		headers: {
			'Accept-Language': options.lang
		}
	};

	return rp(reqOptions)
	.then((data) => {
		return {
			result: data.AbstractText,
			image: data.Image
		};
	});
}
