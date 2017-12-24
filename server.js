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
	var response = 
  	{
  		"speech": data.result.fulfillment.speech,
  		"displayText": data.result.fulfillment.speech,
  		"data": {'gif': ''},
  		"contextOut": [],
  		"source": "Genie" 
	  }
	

	//console.log('received event payload: ', JSON.stringify(data, null, 4))

	var responseString = response.displayText;

	switch (data.result.metadata.intentName) {
		case 'help':
			response.speech = response.displayText = "Try asking about:\nPortfolio analysis\nSecurity data for APPL and NVDA\nSearch securities for APPL and NVDA\nPerformance of APPL and NVDA\n"
			res.json(response)
			break;
		case 'portfolio-analysis':
			// blackrockApi()
			break;
		case 'security-data':
		//resultMap.SECURITY.gics1Sector gics3industry 
		  blackrockApi(data.result, function(err, blackRes) {
//   		  console.dir(blackRes)
  		  response.speech = response.displayText = response.displayText + " \n GICS 1 Sector: " + blackRes.SECURITY[0].gics1Sector + ". \n GICS 3 Industry: " + blackRes.SECURITY[0].gics3Industry
  		  
  		  relevantGif(data.result.metadata.intentName, function(err, gifRes) {
    		  response.data.gif = gifRes
    		  
    		  console.log('response payload: ' + JSON.stringify(response))
    		  res.json(response)
  		  })
		  })
			break;
			
		case 'search-securities':
		//resultMap.SEARCH_RESULTS.resultList[0].assetType assetClass
		  blackrockApi(data.result, function(err, blackRes){
  		  response.speech = response.displayText = response.displayText + " \n Asset Type: " + blackRes.SEARCH_RESULTS[0].resultList[0].assetType + ". \n Asset Class: " + blackRes.SEARCH_RESULTS[0].resultList[0].assetClass
  		  
  		  relevantGif(data.result.metadata.intentName, function(err, gifRes) {
    		  response.data.gif = gifRes
    		  
    		  console.log('response payload: ' + JSON.stringify(response))
    		  res.json(response)
  		  })
		  })
			break;
			
		case 'performance':
		  blackrockApi(data.result, function(err, blackRes){
  		  response.speech = response.displayText = response.displayText + " \n Start Date Risk: " + blackRes.RETURNS[0].latestPerf.sinceStartDateRisk + ". \n Since start date: " + blackRes.RETURNS[0].latestPerf.sinceStartDate + ". \n High return: " + blackRes.RETURNS[0].highReturn + ". \n Low return: " + blackRes.RETURNS[0].lowReturn
  		  
  		  console.dir(blackRes.RETURNS[0].latestPerf)
  		  
  		  relevantGif(data.result.metadata.intentName, function(err, gifRes) {
    		  response.data.gif = gifRes
    		  
    		  console.log('response payload: ' + JSON.stringify(response))
    		  res.json(response)
  		  })
		  })
			break;
			
		case 'learn':
			//
			break;
		default:
			response.speech = response.displayText = "Oh no no no, nooo! Try typing 'help' and I'll see if I can grant your wish."
			res.json(response)
	}

});

function blackrockApi(dataResult, callback) {
	var returnData
	var url = 'https://www.blackrock.com/tools/hackathon/' + dataResult.metadata.intentName
	var tickers = {identifiers : dataResult.parameters.tickers}
	console.log(tickers)

	request({url:url, qs:tickers}, function(error, res2) {
  	res2.body = JSON.parse(res2.body)
		console.log("Blackrock API "+res2.statusCode)
		if (!error && res2.statusCode == 200) {
			callback(null,res2.body.resultMap)
		}else{
  	  callback(true)	
		}
	});
	
}

function relevantGif(intent, callback) {
	const relevantTag = ''
	request({url:'http://api.giphy.com/v1/gifs/search', qs:{api_key:'988ef12db44f4567ab3b3997b85df0f8',  q:intent, limit:1, rating:'pg-13', lang:'en', type:'text/json'}}, function(error, res3) {
  	res3.body = JSON.parse(res3.body)
		if(!error && res3.statusCode == 200) {
			callback(null, 'https://media.giphy.com/media/' + res3.body.data[0].id + '/source.gif')
		}
	})
}

// spin spin sugar - dennis thomas 2k17
app.listen(5000, function() {
	console.log('running on port', 5000)
});