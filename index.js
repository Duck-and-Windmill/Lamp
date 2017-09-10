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

	responseString = "";

	switch (data.result.metadata.intentName) {
		case 'help':
			responseString = "Try asking about:\nPortfolio analysis\nSecurity data for APPL and NVDA\nSearch securities for APPL and NVDA\nPerformance of APPL and NVDA\n"
			break;
		case 'portfolio_analysis':
			// blackrockApi()
			break;
		case 'security_data':
		case 'search_securities':
		case 'performance':
			response.data = blackrockApi(data.result)
			break;
		case 'learn':
			//
			break;
		default:
			responseString = "Oh no no no, nooo! Try typing 'help' and I'll see if I can grant your wish."
	}

	response.speech = response.displayText = responseString

	function blackrockApi(dataResult) {
		var endpoint = dataResult.metadata.intentName
		var tickers = '?identifiers=' + JSON.stringify(dataResult.parameters)

		request('https://www.blackrock.com/tools/hackathon/' + endpoint + tickers, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}).pipe(returnData)

		return returnData
	}

	// else if (data.result.metadata.intentName === 'portfolio_analysis') {
	// 	// TO-DO: pull positions from robinhood
	// 	const positions = ''
	// 	request('https://www.blackrock.com/tools/hackathon/portfolio-analysis', positions, function(error, response, body) {
	// 		if (!error && response.statusCode == 200) {
	// 			console.log(body)
	// 		}
	// 	}).pipe(response.data)
	// }

	console.log('response payload: ' + JSON.stringify(response))

	res.setHeader('Content-Type', 'application/JSON');
	res.send(response)
});

// spin spin sugar - dennis thomas 2k17
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
});


