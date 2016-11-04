var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){

	var email = msg.email;
	var cartId = msg.cartId;
	//var addToCart = "INSERT INTO shopping_cart (email, item_id, quantity) VALUES ('"+email+"', '"+itemId+"', '"+quantity+"');";

	//var msg_payload = {"email":email, "itemId": itemId, "itemName":itemName, "itemPrice":itemPrice, "quantity":quantity};
	var itemId = msg.itemId;
	var maxBid = msg.maxBid;
	var email = msg.email;
	var json_responses;
	//var bidQuery = "UPDATE products SET max_bid='"+maxBid+"', max_bidder='"+req.session.username+"' WHERE item_id='"+tempItemId+"'";
	//var oldBid = "SELECT max_bid FROM products WHERE item_id='"+tempItemId+"'";

	//var msg_payload = {"email":req.session.username, "itemId": tempItemId, "maxBid": maxBid};

	var res = {};
	//console.log("In handle request:"+ msg.username);
	//var email = msg.email;

	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');

		coll.findOne({item_id:itemId},{fields:{max_bid:1}}, function(err, user){
			if(user){
				if(user.max_bid < maxBid)
				{
					coll.updateOne({item_id:itemId}, {$set:{max_bid:maxBid, max_bidder:email}}, function(err, user){
						if(user)
						res.code = "200";
					//console.log(res.code+"inplacebid");
					callback(null, res);
					});
				}
				else
				{
					res.code = "200";
					callback(null, res);
				}

			}
			else
			{
				res.code = "401";
				res.value = "Failed";
			}
			//
			//console.log(res.code+"outerplacebid");
			

		});
	});

}

exports.handle_request = handle_request;