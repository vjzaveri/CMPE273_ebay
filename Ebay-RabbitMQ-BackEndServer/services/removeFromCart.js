var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){

	var email = msg.email;
	var cartId = msg.cartId;
	//var addToCart = "INSERT INTO shopping_cart (email, item_id, quantity) VALUES ('"+email+"', '"+itemId+"', '"+quantity+"');";

	//var msg_payload = {"email":email, "itemId": itemId, "itemName":itemName, "itemPrice":itemPrice, "quantity":quantity};


	var res = {};
	//console.log("In handle request:"+ msg.username);
	//var email = msg.email;

	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer');

		coll.update({email: email}, {$pull:{shopping_cart:{cart_id:cartId}}}, function(err, user){
			if (user) {
				res.code = "200";
				res.value = "Success";
				//res.shopping_cart = user.shopping_cart;

			} else {
				res.code = "401";
				res.value = "Failed";
			}
				callback(null, res);
		});
	});

}

exports.handle_request = handle_request;