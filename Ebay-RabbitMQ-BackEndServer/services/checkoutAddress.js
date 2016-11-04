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

		coll.findOne({email: email}, {fields:{cellphone_number:1, address:1, city:1, state:1, country:1, zip:1}}, function(err, user){
			if (user) {
				res.code = "200";
				res.value = "Success";
				//res.data = user.shopping_cart;
				res.data = {"cellphone_number":user.cellphone_number, "address": user.address, "city": user.city, "state": user.state, "country": user.country, "zip": user.zip};
			} else {
				res.code = "401";
				res.value = "Failed";
			}
				callback(null, res);
		});
	});

}

exports.handle_request = handle_request;