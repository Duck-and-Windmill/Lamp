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
	var response = {body:
  	{
  		"speech": data.result.fulfillment.speech,
  		"displayText": data.result.fulfillment.speech,
  		"data": {'key': 'value'},
  		"contextOut": [],
  		"source": "Genie" 
	  }
	}

	//console.log('received event payload: ', JSON.stringify(data, null, 4))

	var responseString = "";

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
			response.data.gif = relevantGif(data.result.metadata.intentName)
			break;
		case 'learn':
			//
			break;
		default:
			responseString = "Oh no no no, nooo! Try typing 'help' and I'll see if I can grant your wish."
	}

	response.speech = response.displayText = responseString

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

function blackrockApi(dataResult) {
	var returnData
	var endpoint = dataResult.metadata.intentName
	var tickers = {'identifiers' : dataResult.parameters.tickers}
	console.log(endpoint)
	console.log(tickers)

	request({url:'https://www.blackrock.com/tools/hackathon/' + endpoint, qs:tickers}, function(error, res2) {
		console.log("Blackrock API"+res2)
		if (!error && res2.statusCode == 200) {
			return res2.body
		}
	});
	
}

function relevantGif(dataResult) {
	const relevantTag = ''
	request({url:'http://api.giphy.com/v1/gifs/', qs:{api_key:'988ef12db44f4567ab3b3997b85df0f8', tag:relevantTag, rating:g, fmt:json}} function(error, res2) {
		console.log(res2.statusCode)
		if(!error && res2.statusCode == 200) {
			console.dir(res2)
			return res2.body
		}
	})
}

// spin spin sugar - dennis thomas 2k17
app.listen(80, function() {
	console.log('running on port', 80)
});