var mysql = require('./mysql');
var crypto = require('crypto'),
	algorithm = 'aes-256-ctr',
	password = 'youcantknowthis';

encrypt = function(input)
{
	var cipher = crypto.createCipher(algorithm,password);
	var crypted = cipher.update(input,'utf8','hex');
	crypted = crypted + cipher.final('hex');
	return crypted;
}


exports.checkLogin = function(req, res)
{
	var username = req.param("username");
	var normalPassword = req.param("password");
	var password = encrypt(normalPassword);
	var json_responses;

	var checkUser = "select * from customer where email='"+username+"' and password='" +password+ "'";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			if(results.length > 0)
			{

				//Retrieve last logged in time before, write logic here
				var todayDate = new Date();
				var year = todayDate.getFullYear();
				var month = parseInt(todayDate.getMonth())+1;
				var date = todayDate.getDate();
				var hour = todayDate.getHours();
				var minute = todayDate.getMinutes();
				var second = todayDate.getSeconds();
				var lastLoggedInTime = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
				console.log("Todays Date:"+todayDate);
				var setLastLoggedInTime = "UPDATE customer SET last_logged_in='"+lastLoggedInTime+"' WHERE email='"+username+"'";
				mysql.runQuery(function(err,results){
					if(!err)
					{
						console.log("Timestamp Stored");
					}
					else
					{
						console.log("Error in updating Timestamp");
					}
				},setLastLoggedInTime);

				req.session.username = username;
				console.log("Session initialized");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}
			else
			{
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},checkUser);
}


exports.newUser = function(req,res)
{
	var username = req.param("username");
	var normalPassword = req.param("password");
	var password = encrypt(normalPassword);
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");

	var newUser = "INSERT INTO customer (email, first_name, last_name, password) VALUES ('"+username+"', '"+firstName+"', '"+lastName+"', '"+password+"')";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			console.log("New User Created");
			json_responses = {"statusCode" : 200};
			
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},newUser);
}