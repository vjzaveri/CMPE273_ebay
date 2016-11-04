var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	var email = msg.email;
	var cardNumber = msg.cardNumber;

	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll1 = mongo.collection('customer');
		var coll2 = mongo.collection('products');

		coll1.findOne({email: email}, {fields:{shopping_cart:1}}, function(err, user1){
			if (user1) {
				//res.code = "200";
				//res.value = "Success";
				//res.shopping_cart = user1.shopping_cart;

				var noOfProducts = user1.shopping_cart.length;
				var i;
				for(i=0;i<noOfProducts;i++)
				{
					var tempItemDescription = user1.shopping_cart[i].item_description;
					var tempItemName = user1.shopping_cart[i].item_name;
					var tempItemPrice = user1.shopping_cart[i].item_price;
					var tempQuantity = user1.shopping_cart[i].quantity;
					var tempItemId1 = user1.shopping_cart[i].item_id;
					var tempCartId = user1.shopping_cart[i].cart_id;
					//name, desc, price, quan;
					coll2.findOne({item_id:user1.shopping_cart[i].item_id}, {fields:{seller_id:1, item_id:1}}, function(err, user2){
						if(user2)
						{
							var tempItemId2 = user2.item_id;
							console.log("in samasya:"+tempItemId2);
							coll1.update({email:user2.seller_id}, {$push:{selling_info:{item_id:tempItemId2, item_name:tempItemName, item_description:tempItemDescription, item_price:tempItemPrice, quantity:tempQuantity}}}, function(err, user3){
								if(user3)
								{
									coll1.update({email:email}, {$push:{purchase_info:{item_id:tempItemId2, item_name:tempItemName, item_description:tempItemDescription, item_price:tempItemPrice, quantity:tempQuantity, credit_card_number:cardNumber}}}, function(err, user4){
										if(user4)
										{
											coll2.update({item_id:tempItemId1}, {$inc:{quantity:-1}}, function(err, user5){
												if(user5)
												{
													coll1.update({email:email}, {$pull:{shopping_cart:{cart_id:tempCartId}}}, function(err, user6){
														if(user6)
														{
															res.code = "200";
															callback(null,res);
														}
														else
														{
															res.code = "401";
															callback(null,res);
														}
													});
													
												}
											});
										}
									});
								}
							});
						}

					});
				}



			} else {
				res.code = "401";
				res.value = "Failed";
			}
				//callback(null, res);
		});
	});

}

exports.handle_request = handle_request;