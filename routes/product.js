var mysql = require('./mysql');

exports.sellItem = function(req,res)
{
	var itemName = req.param("itemName");
	var itemDescription = req.param("itemDescription");
	var itemPrice = req.param("itemPrice");
	var quantity = req.param("quantity");
	var buyNow = !req.param("buyNow");
	if(buyNow)
	{
		buyNow=1;
	}
	else
	{
		buyNow=0;
	}
	var initialBidding = req.param("initialBidding");
	var maxBidder = req.session.username;

	var todayDate = new Date();
	var year = todayDate.getFullYear();
	var month = parseInt(todayDate.getMonth())+1;
	var date = todayDate.getDate();
	var hour = todayDate.getHours();
	var minute = todayDate.getMinutes();
	var second = todayDate.getSeconds();
	var milliSecond = todayDate.getMilliseconds();
	var timeOfAdvertisement = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;

	var itemId = maxBidder+"_"+date+"_"+hour+"_"+minute+"_"+second+"_"+milliSecond;

	console.log("Item for Sell" +itemName+":"+itemDescription+":"+itemPrice+":"+quantity+":"+buyNow+":"+initialBidding+":"+maxBidder);
	var json_responses={"statusCode": 200};

	//create the query to insert this data and also create a query to create an timely event for 4 days bidding.
	var insertProduct = "INSERT INTO products (item_id, item_name, item_description, seller_id, item_price, quantity, buy_now, max_bid, max_bidder, category, timestamp) VALUES ('"+itemId+"', '"+itemName+"', '"+itemDescription+"', '"+maxBidder+"', '"+itemPrice+"', '"+quantity+"', '"+buyNow+"', '"+initialBidding+"', '"+maxBidder+"', '', '"+timeOfAdvertisement+"')";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			console.log("Advertisement Posted with itemId:"+itemId);
			var tempMonth = parseInt(month);
			if(tempMonth==1 || tempMonth==3 || tempMonth==5 || tempMonth==7 || tempMonth==8 || tempMonth==10)
			{
				if(parseInt(date)>=28)
				{
					tempMonth++;
					date = (parseInt(date)+4)%31;
				}
				else
				{
					date = parseInt(date)+4;
				}
			}
			else if(tempMonth==12)
			{
				if(parseInt(date)>=28)
				{
					tempMonth=1;
					year = parseInt(year)+1;
					date = (parseInt(date)+4)%31;
				}
				else
				{
					date = parseInt(date)+4;
				}
			}
			else if(tempMonth==2)
			{
				if(parseInt(year)%4==0)
				{
					if(parseInt(year)%100==0)
					{
						if(parseInt(year)%400==0)
						{
							if(parseInt(date)>=25)
							{
								tempMonth++;
								date = (parseInt(date)+4)%29;
							}
							else
							{
								date = parseInt(date)+4;
							}
						}
						else
						{
							if(parseInt(date)>=24)
							{
								tempMonth++;
								date = (parseInt(date)+4)%28;
							}
							else
							{
								date = parseInt(date)+4;
							}
						}
					}
					else
					{
						if(parseInt(date)>=24)
						{
							tempMonth++;
							date = (parseInt(date)+4)%28;
						}
						else
						{
							date = parseInt(date)+4;
						}
					}
				}
				else
				{
					if(parseInt(date)>=24)
					{
						tempMonth++;
						date = (parseInt(date)+4)%28;
					}
					else
					{
						date = parseInt(date)+4;
					}
				}
			}
			else
			{
				if(parseInt(date)>=27)
				{
					tempMonth++;
					date = (parseInt(date)+4)%30;
				}
				else
				{
					date = parseInt(date)+4;
				}
			}

			month = tempMonth;

			var createEvent = "CREATE EVENT "+maxBidder+"_"+itemId+" ON SCHEDULE AT '"+year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second+"' DO BEGIN  END               ";
			//create logic for event-- pending
			json_responses = {"statusCode" : 200};
			
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},insertProduct);

	res.send(json_responses);
}


exports.displayAllProducts = function(req,res)
{
	var getProducts = "SELECT * FROM products WHERE quantity > 0";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			console.log("All Products Pulled");
			//var finalResult = JSON.parse(JSON.stringify(results));
			var finalResult = JSON.stringify(results);
			json_responses = {"statusCode" : 200, "allProducts" : results};
			
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},getProducts);
}

exports.addToCart = function(req,res)
{
	var itemId = req.param("itemId");
	var email = req.session.username;
	var quantity = 1;
	var addToCart = "INSERT INTO shopping_cart (email, item_id, quantity) VALUES ('"+email+"', '"+itemId+"', '"+quantity+"');";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			console.log("Product Added to Cart");
			json_responses = {"statusCode" : 200};			
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},addToCart);
}

exports.shoppingCart = function(req,res)
{
	var getCart = "SELECT cart_id, item_name, item_price, shopping_cart.quantity AS quantity FROM shopping_cart, products WHERE shopping_cart.item_id=products.item_id AND email = '"+req.session.username+"'";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			console.log("User Shopping Cart Pulled");
			//var finalResult = JSON.parse(JSON.stringify(results));
			var finalResult = JSON.stringify(results);
			json_responses = {"statusCode" : 200, "shoppingCartProducts" : results};
			
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},getCart);
}

exports.removeFromCart = function(req,res)
{
	var reqCartId = req.param("temp");
	var removeItemFromCart = "DELETE FROM shopping_cart WHERE cart_id='"+reqCartId+"'";

	mysql.runQuery(function(err,results){
		if(!err)
		{
			console.log("One Item removed from Cart");
			//var finalResult = JSON.parse(JSON.stringify(results));
			//var finalResult = JSON.stringify(results);
			json_responses = {"statusCode" : 200};
			
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},removeItemFromCart);
}