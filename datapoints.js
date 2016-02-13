var request = require("request");
var _ = require("underscore");

function Datapoints(options){
	var self = this;

	options = _.extend({
		version: "1"
	}, options || {});

	if (!options.key)
		throw Error("DataPoints: Please provide API - KEY");

	if (!options.secret)
		throw Error("DataPoints: Please provide API - SECRET");

	var version = options.version;
	var key 	= options.key;
	var secret 	= options.secret;
	var serverUrl = "https://datapoints.global";
	if (options.url)
		serverUrl = options.url;

	var API_END_POINT = serverUrl+"/api/"+version+"/"+key+"/"+secret+"/";

	//###########################################################
	// Data Points / variables
	//###########################################################

	self.getVars = function(query, callback){
		if (!callback) {
			callback = query;
			query = {};
		};
		self._request({url: API_END_POINT + "get-vars", form: query, json: true}, callback);
	}

	/**
	* Save var, will update var if uuid is given in data
	* @param {Object} data
	* @return {Object} result
	*
	* Result: {
	*	"newItem": {
	*		"name": "-TEST-",
	*		"value": "-VALUE-",
	*		"color": "#45FF6A",
	*		"isCurrency": null,
	*		"ispublic": false,
	*		"by": "Surinder Singh Mattaur",
	*		"uuid": "bdfa49c0-c9d2-11e5-88fa-c7cec7c0c599"
	*	}
	* }
	*/
	self.setVar = function(data, callback){
		self._request({url: API_END_POINT + "var/save", form: data, json: true}, callback);
	}

	self.deleteVar = function(uuid, callback){
		self._request({url: API_END_POINT + "var/delete", form: {uuid: uuid}, json: true}, callback);
	}

	//###########################################################
	// Data Sets / Groups
	//###########################################################

	self.getGroups = function(query, callback){
		self._request({url: API_END_POINT + "groups", form: query, json: true}, callback);
	}

	self.setGroup = function(data, callback){
		self._request({url: API_END_POINT + "group/save", form: data, json: true}, callback);
	}

	self.addVarsToGroup = function(data, callback){
		self._request({url: API_END_POINT + "group/add-vars", form: data, json: true}, callback);
	}

	self.removeVarsFromGroup = function(data, callback){
		self._request({url: API_END_POINT + "group/remove-vars", form: data, json: true}, callback);
	}

	self.deleteGroup = function(uuid, callback){
		self._request({url: API_END_POINT + "group/delete", form: {uuid: uuid}, json: true}, callback);
	}


	self._request = function(args, callback){
		if(options.debug){
			_head("Request");
			_log(JSON.stringify(args, null, "  "));
		}
		request.post(args, function (err, httpResponse, data) {
			if (err)
				return callback(err);

			if(options.debug){
				_head("Response");
				_log(JSON.stringify(data, null, "  "));
			}

			if (!data)
				return callback({error: "Invalid response from server."});

			if(httpResponse.statusCode != 200 || _.isString(data))
				return callback({error: "Invalid response from server."});

			if (data.error)
				return callback(data);

			callback(null, data);
		});
	}
}

String.prototype.__repeat = function( num ){
    return new Array( num + 1 ).join( this );
}

function _head(heading, padText, padLength){
	var lineEnd = "\n";
	padText 	= padText || "=";
	padLength 	= padLength || 20;
	var l 		= padText.__repeat(padLength)+" "+heading+" "+padText.__repeat(padLength);
	console.log(lineEnd+l+lineEnd+padText.__repeat(parseInt(l.length / padText.length) ));
}
function _log(){
	console.log.apply(console, arguments)
}

Datapoints._logHead = _head;
Datapoints._log = _log;
module.exports = Datapoints


