var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	var email = msg.email;

	var address = msg.address;
	var city = msg.city;
	var state = msg.state;
	var country = msg.country;
	var zip = msg.zip;
	var cellNum = msg.cellNum;
	

	//var msg_payload = {"email":req.session.username, "address":address, "city":city, "state":state, "country":country, "zip":zip, "cellNum":cellNum};

	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer');

		coll.updateOne({email: email}, {$set:{cellphone_number:cellNum, address:address, city:city, state:state, country:country, zip:zip}}, function(err, user){
			if (user) {
				res.code = "200";
				res.value = "Success";
				//res.data = user.shopping_cart;
				//res.data = {"cellphone_number":user.cellphone_number, "address": user.address, "city": user.city, "state": user.state, "country": user.country, "zip": user.zip};
			} else {
				res.code = "401";
				res.value = "Failed";
			}
				callback(null, res);
		});
	});

}

exports.handle_request = handle_request;