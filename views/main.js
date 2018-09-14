var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App');

module.exports = function(data, containerId) {
	var container = document.getElementById(containerId || 'content');
	ReactDOM.render(<App {...data} />, container);
};
