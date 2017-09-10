'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');


app.set('port', (process.env.PORT || 5000))
// parse application
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function(req, res) {
	res.send('user_input');
});

// Message handler
app.post('/webhook', function(req, res) {
	// Parse messenger payload
	// Check Webhook reference
	// https://api.ai/docs/fulfillment#response
	const data = req.body;
	var text_response = {
		"speech": data.result.fulfillment.speech,
		"displayText": data.result.fulfillment.speech,
		"data": {'key': 'value'},
		"contextOut": [],
		"source": Genie 
	}

	console.log('received event payload: ', JSON.stringify(data, null, 4))

	if (data.result.metadata.intentName === 'help') {
		response.speech = response.displayText = "Try asking about:\nPortfolio analysis\nSecurity data for APPL and NVDA\nSearch securities for APPL and NVDA\nPerformance of APPL and NVDA\n"
	}
	else if (data.result.metadata.intentName === 'portfolio_analysis') {
		// TO-DO: pull positions from robinhood
		const positions = ''
		request('https://www.blackrock.com/tools/hackathon/portfolio-analysis', positions, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'security_data') {
		// TODO: reference entities from api.ai
		const tickers = '?identifiers=' + JSON.stringify(data.result.parameters)
		request('https://www.blackrock.com/tools/hackathon/security-data' + tickers, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'search_securities') {
		// TODO: reference entities from api.ai
		const tickers = '?identifiers=' + JSON.stringify(data.result.parameters)
		request('https://www.blackrock.com/tools/hackathon/search-securities' + tickers, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'performance') {
		// TODO: reference entities from api.ai
		const tickers = '?identifiers=' + JSON.stringify(data.result.parameters)
		request('https://www.blackrock.com/tools/hackathon/performance' + tickers, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'learn') {

	}
	else {
		response.speech = response.displayText = "Oh no no no, nooo! Try typing 'help' and I'll see if I can grant your wish."
	}

	console.log('response payload: ' + JSON.stringify(response))

	res.setHeader('Content-Type', 'application/JSON');
	res.send(response)
});

// spin spin sugar - dennis thomas 2k17
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
});


