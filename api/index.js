const express = require('express');
const router = express.Router();
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const config = require('./config.js');

var generateRandomString = function (length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = 'spotify_auth_state';

router.use(cors()).use(cookieParser());

router.get('/login', function (req, res) {

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

router.get('/callback', function (req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.json({
			error: 'state_mismatch'
		});
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
				'Authorization': 'Basic ' + (Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'))
			},
			json: true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {

				var access_token = body.access_token,
					refresh_token = body.refresh_token;

				// we can also pass the token to the browser to make requests from there
				res.redirect('/login?blob='+JSON.stringify({access_token, refresh_token}));
				return;
				res.json({
					access_token: access_token,
					refresh_token: refresh_token
				});
			} else {
				res.json({error: "invalid_token"});
			}
		});
	}
});

router.get('/refresh_token', function (req, res) {

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
		}
	});
});

router.get('*', (req, res) => {
	routes = router.stack.map((e) => {
		if (e && e.route && e.route.path && e.route.path != null) {
			return e.route.path;
		}
		return undefined
	});
	res.json({
		paths: routes.filter(e => e)
	});
});

module.exports = router;