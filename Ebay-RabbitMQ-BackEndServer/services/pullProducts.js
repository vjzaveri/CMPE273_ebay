var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');


		coll.find().toArray(function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//msg.session.username = user.username;
				//console.log(msg.session.username +" is the session");
				res.code = "200";
				res.value = "Success Login";
				res.last_logged_in = user.last_logged_in;
				res.data = user;

			} else {
				console.log("returned false");
				res.code = "401";
				res.value = "Failed Login";
			}
				callback(null, res);
		});

/*
		coll.find({}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//msg.session.username = user.username;
				//console.log(msg.session.username +" is the session");
				res.code = "200";
				res.value = "Success Login";
				res.last_logged_in = user.last_logged_in;
				res.data = user;

			} else {
				console.log("returned false");
				res.code = "401";
				res.value = "Failed Login";
			}
				callback(null, res);
		});
*/
	});


}

exports.handle_request = handle_request;