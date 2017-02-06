'use strict';

var states = {};

module.exports = {
	getState: (msg) => states[getId(msg)],
	setState: (val, msg) => states[getId(msg)] = val,
	deleteState: (msg) => delete states[getId(msg)]
};

function getId(msg) {
	return `${msg.from.id}-${msg.chat.id}`;
}
