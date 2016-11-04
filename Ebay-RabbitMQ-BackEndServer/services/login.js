var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";



function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
/*	if(msg.username == "test@email.com" && msg.password =="test"){
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
	var password = msg.password;
	console.log(password +" is the object");
	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer');

		coll.findOne({email: username, password:password}, {fields:{email:1,last_logged_in:1}}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//msg.session.username = user.username;
				//console.log(msg.session.username +" is the session");
				res.code = "200";
				res.value = "Success Login";
				res.last_logged_in = user.last_logged_in;
				res.username = user.email;

				console.log("In login: "+user.email);
				var todayDate = new Date();
				var year = todayDate.getFullYear();
				var month = parseInt(todayDate.getMonth())+1;
				var date = todayDate.getDate();
				var hour = todayDate.getHours();
				var minute = todayDate.getMinutes();
				var second = todayDate.getSeconds();
				var lastLoggedInTime = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
				coll.updateOne({email:username}, {$set:{last_logged_in:lastLoggedInTime}}, function(err, user){
					if(err){
						res.code="401";
						
					}
				});

			} else {
				console.log("returned false");
				res.code = "401";
				res.value = "Failed Login";
			}
				callback(null, res);
		});
	});

}

exports.handle_request = handle_request;