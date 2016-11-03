var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){
	


	var itemId = msg.itemId;
	var itemName = msg.itemName;
	var itemPrice = msg.itemPrice;
	var email = msg.email;
	var quantity = msg.quantity;
	//var addToCart = "INSERT INTO shopping_cart (email, item_id, quantity) VALUES ('"+email+"', '"+itemId+"', '"+quantity+"');";

	//var msg_payload = {"email":email, "itemId": itemId, "itemName":itemName, "itemPrice":itemPrice, "quantity":quantity};

	var todayDate = new Date();
	var date = todayDate.getDate();
	var hour = todayDate.getHours();
	var minute = todayDate.getMinutes();
	var second = todayDate.getSeconds();
	var milliSecond = todayDate.getMilliseconds();
	//var timeOfAdvertisement = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;

	var cartId = email+"_"+date+"_"+hour+"_"+minute+"_"+second+"_"+milliSecond;


	var res = {};
	console.log("In handle request:"+ msg.username);
	var email = msg.email;

	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer');

		coll.update({email: email}, {$push:{shopping_cart:{cart_id:cartId, item_id:itemId, item_name: itemName, item_price: itemPrice, quantity:quantity}}}, function(err, user){
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