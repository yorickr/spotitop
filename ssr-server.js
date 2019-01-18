const express = require('express');
const next = require('next');
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const config = require('./api/config.js');

nextApp.prepare()
	.then(() => {
		const app = express();
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.use('/api/', require('./api/index.js'));
		
		app.get('*', (req, res) => {
			return handle(req, res);
		});
		app.listen(config.port, (err) => {
			if (err) throw err
			console.log('> Ready on http://localhost:3000');
		});
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
