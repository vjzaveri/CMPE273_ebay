var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function handle_request(msg, callback){
	
	var res = {};
/*	console.log("In handle request:"+ msg.username);
	
	if(msg.username == "test@email.com" && msg.password =="test"){
		res.code = "200";
		res.value = "Succes Login";
		
	}
	else{
		res.code = "401";
		res.value = "Failed Login";
	}
	callback(null, res);

*/

	var username = msg.username;
	var firstName = msg.firstName;
	var lastName = msg.lastName;
	var password = msg.password;
	//console.log(password +" is the object");
	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer');

		coll.insert({_id:username, email: username, first_name: firstName, last_name:lastName, password:password, cellphone_number:"", address:"", city:"", state:"", country:"", zip:"", last_logged_in:"", purchase_info:[], selling_info:[], shopping_cart:[]}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				//console.log(req.session.username +" is the session");
				res.code = "200";
				res.value = "Succes Login";

			} else {
				res.code = "401";
				res.value = "Failed Login";
			}
			callback(null,res);
		});
	});









}

exports.handle_request = handle_request;