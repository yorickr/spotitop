/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var config = require('./config.js');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

app.get('/login', function (req, res) {

	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	var scope = 'user-read-private user-read-email user-top-read';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: config.client_id,
			scope: scope,
			redirect_uri: config.redirect_uri,
			state: state
		}));
});

// var allItems = [];

// const dothing = (url, token, cb) => {
// 	request.get({
// 		url,
// 		headers: { 'Authorization': 'Bearer ' + token },
// 		json: true
// 	}, (error, response, body) => {
// 		if (error) {
// 			return;
// 		}
// 		// console.log(body);
// 		if (body.next) {
// 			dothing(body.next, token, cb);
// 		}
// 		console.log(body.items.length);
// 		allItems.push(...body.items);
// 		console.log(`I have ${allItems.length} items`);
// 		if (cb) {
// 			cb();
// 		}
// 	});
// };

app.get('/callback', function (req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			}));
	} else {
		res.clearCookie(stateKey);
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: config.redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
			},
			json: true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {

				var access_token = body.access_token,
					refresh_token = body.refresh_token;

				// var options = {
				// 	url: 'https://api.spotify.com/v1/me',
				// 	headers: { 'Authorization': 'Bearer ' + access_token },
				// 	json: true
				// };

				// use the access token to access the Spotify Web API
				// request.get(options, function (error, response, body) {
				// 	console.log(body);
				// });

				// we can also pass the token to the browser to make requests from there
				res.redirect('/#' +
					querystring.stringify({
						access_token: access_token,
						refresh_token: refresh_token
					}));
			} else {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_token'
					}));
			}
		});
	}
});

app.get('/refresh_token', function (req, res) {

	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64')) },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({
				'access_token': access_token
			});
			// dothing('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', access_token, () => {
			// 	console.log('All tracks');
			// 	allItems.forEach((t) => {
			// 		console.log(t.name);
			// 	});
			// });

		}
	});
});

console.log('Listening on ' + config.port);
app.listen(config.port);
