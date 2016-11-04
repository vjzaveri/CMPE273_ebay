var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	var email = msg.email;

	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer');

		coll.findOne({email: email}, {fields:{selling_info:1}}, function(err, user){
			if (user) {
				res.code = "200";
				res.value = "Success";
				res.data = user.selling_info;

			} else {
				res.code = "401";
				res.value = "Failed";
			}
				callback(null, res);
		});
	});

}

exports.handle_request = handle_request;