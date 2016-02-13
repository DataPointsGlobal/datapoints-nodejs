var API = require("./datapoints");
var _ = require("underscore");


var apiClient = new API({
	key: "YOUR-API-KEY",
	secret: "YOUR-API-SECRET",
	url: "http://localhost:3323",
	//debug: true
});


/**
 * Get variables according to devices
 */
apiClient.getVars(callback("getVars"));

/**
 * Add/Edit var
 */
//apiClient.setVar({uuid:"70d950f0-c9d7-11e5-9ce9-fbb1faf1d194", name: "VAR BY API", value: "-VALUE-", color: "#FEE720" }, callback("saveVar"));


/**
 * Delete var
 */
//apiClient.deleteVar("bdfa49c0-c9d2-11e5-88fa-c7cec7c0c599", callback("deleteVar"));

/*-----------------------------------------------------------------*/
/**
 * Get Groups
 */
//apiClient.setGroups({ name: "-TEST-" }, callback("getGroups"));

/**
 * Add/Edit Group
 */
//apiClient.setGroup({uuid: "a8c9d560-ca8c-11e5-acf9-1975c8e2c233", name:"GROUP BY API", datapoints:["bdfa49c0-c9d2-11e5-88fa-c7cec7c0c599"]}, callback("saveGroup"));


/**
 * Add vars to Group
 */
//apiClient.addVarsToGroup({uuid: "a8c9d560-ca8c-11e5-acf9-1975c8e2c233", datapoints:["70d950f0-c9d7-11e5-9ce9-fbb1faf1d194"]}, callback("addVarsToGroup"));

/**
 * Remove vars from Group
 */
//apiClient.removeVarsFromGroup({uuid: "17a97fb0-ca8a-11e5-a906-73a336107c88", datapoints:["bdfa49c0-c9d2-11e5-88fa-c7cec7c0c599"]}, callback("removeVarsFromGroup"));


/**
 * Remove all vars from Group
 */
//apiClient.removeVarsFromGroup({uuid: "17a97fb0-ca8a-11e5-a906-73a336107c88", all: true}, callback("removeAllVarsFromGroup"));

/**
 * Delete Group
 */
//apiClient.deleteGroup("d27579c0-ca8a-11e5-acf9-1975c8e2c233", callback("deleteGroup"));


function callback(name){
	return function(err, data){
		API._logHead(name.toUpperCase(), "-", 5);
		if (err){
			console.log("Error: ", err);
		}else{
			console.log(JSON.stringify(data, null, "  ") );
		}
	}
}
