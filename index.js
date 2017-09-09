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
	var response = {
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
		request({
			uri: "https://www.blackrock.com/tools/hackathon/portfolio-analysis"
			qs: {
				// need to use google cloud to host database of positions of various users
				query: portfolio_position
			} 
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'security_data') {
		request({
			uri: "https://www.blackrock.com/tools/hackathon/security-data"
			qs: {
				// TO-DO: create variable that stores tickers input by user
				query: data.result.parameters.Entities
			} 
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'search_securities') {
		request({
			uri: "https://www.blackrock.com/tools/hackathon/search-securities"
			qs: {
				query: data.result.parameters.Entities
			} 
		}).pipe(response.data)
	}
	else if (data.result.metadata.intentName === 'performance') {
		request({
			uri: "https://www.blackrock.com/tools/hackathon/performance"
			qs: {
				query: data.result.parameters.Entities
			} 
		}).pipe(response.data)
	}
	else {
		response.speech = response.displayText = "Oh no no no! Try typing 'help' and I'll see if I can grant your wish."
	}

});


