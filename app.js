const _ = require('lodash')
const express = require('express')
const reactViews = require('express-react-views')
const morgan   = require('morgan')
const cookieSession = require('cookie-session')
require('dotenv').config()

let PASS, BASE_URL

const env_var = process.env.NODE_ENV.replace(/[\n\s]/g, '')
const dev = env_var !== 'production'
const USER = process.env.LOCAL_USERNAME

if (dev) {
	PASS = process.env.LOCAL_PASS
	BASE_URL = process.env.LOCAL_URL
} else {
	PASS = process.env.PRODUCTION_PASS
	BASE_URL = process.env.PRODUCTION_URL
}

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieSession({
	secret:'appman2004',
	name: 'googleAppman',
	maxAge: 24 * 60 * 60 * 1000 // 24 hour in millisec
}))

app.set('_USER', USER)
app.set('_PASS', PASS)
app.set('_BASE_URL', BASE_URL)

app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());

require('./routers')(app)

var port = process.env.LOCAL_PORT || 3000;
app.listen(port, function() {
	console.log('Server is listening on port ' + port);
});

module.exports = app;

