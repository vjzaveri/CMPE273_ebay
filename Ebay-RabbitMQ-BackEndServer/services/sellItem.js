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

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var itemName = msg.itemName;
	var itemDescription = msg.itemDescription;
	var itemPrice = msg.itemPrice;
	var quantity = msg.quantity;
	var buyNow = msg.buyNow;
	var initialBidding = msg.initialBidding;
	var maxBidder = msg.maxBidder;

	if(buyNow)
	{
		buyNow=0;
	}
	else
	{
		buyNow=1;
	}
	


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
	if(buyNow == 0)
	{
		var insertProduct = "INSERT INTO products (item_id, item_name, item_description, seller_id, quantity, buy_now, max_bid, max_bidder, category, timestamp) VALUES ('"+itemId+"', '"+itemName+"', '"+itemDescription+"', '"+maxBidder+"', '"+quantity+"', '"+buyNow+"', '"+initialBidding+"', '"+maxBidder+"', '', '"+timeOfAdvertisement+"')";
		

		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');

		coll.insert({_id:itemId, item_id: itemId, item_name:itemName, item_description:itemDescription, seller_id:maxBidder, item_price:"", quantity:quantity, buy_now:buyNow, max_bid:initialBidding, max_bidder:maxBidder, timestamp:timeOfAdvertisement}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				//console.log(req.session.username +" is the session");
				res.code = "200";
				res.value = "Product Added";

			} else {
				res.code = "401";
				res.value = "Failed";
			}
			callback(null,res);
		});
	});


	}
	else
	{
		var insertProduct = "INSERT INTO products (item_id, item_name, item_description, seller_id, item_price, quantity, buy_now, timestamp) VALUES ('"+itemId+"', '"+itemName+"', '"+itemDescription+"', '"+maxBidder+"', '"+itemPrice+"', '"+quantity+"', '"+buyNow+"', '"+timeOfAdvertisement+"')";
	
		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');

		coll.insert({_id:itemId, item_id: itemId, item_name:itemName, item_description:itemDescription, seller_id:maxBidder, item_price:itemPrice, quantity:quantity, buy_now:buyNow, max_bid:"", max_bidder:"", timestamp:timeOfAdvertisement}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				//console.log(req.session.username +" is the session");
				res.code = "200";
				res.value = "Product Added";

			} else {
				res.code = "401";
				res.value = "Failed";
			}
			callback(null,res);
		});
	});

	}
/*
	mysql.runQuery(function(err,results){
		if(!err)
		{
			fileLogger.info("Advertisement posted for user: "+req.session.username+" with Item ID: "+itemId);
			console.log("Advertisement Posted with itemId:"+itemId);
			if(buyNow == 0)
			{
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
				var fixedFinaldate = new Date(year,month-1,date,hour,minute,second);
				//var fixedFinaldate = new Date(2016,9,15,16,48,00);
				console.log("Fixedfinaldate:"+fixedFinaldate);
				var tempBindVar = itemId;
				if(buyNow==0)
				{
					fileLogger.info("Created the cron job for 4 day bidding for Item ID: "+itemId+" sold by user: "+req.session.username);
					//log.info("Created the cron job for 4 day bidding for Item ID: "+itemId+" sold by user: "+req.session.username+" for timestamp: "+fixedFinaldate);
					var newCron = schedule.scheduleJob(fixedFinaldate,function(itemId){
						console.log("Cron Job executed for date:"+fixedFinaldate);
						//var item_id=item_id;
						//var quantity = quantity;
						//var itemPrice = itemPrice;
						
						var updateSellingInfo = "INSERT INTO selling_info (email, item_id, quantity, price) VALUES ((SELECT seller_id FROM products WHERE item_id = '"+itemId+"'), '"+itemId+"', (SELECT quantity FROM products WHERE item_id = '"+itemId+"'), (SELECT max_bid FROM products WHERE item_id = '"+itemId+"'))";
						var updatePurchaseInfo = "INSERT INTO purchase_info (email, item_id, quantity, price, credit_card_number) VALUES ((SELECT max_bidder FROM products WHERE item_id = '"+itemId+"'), '"+itemId+"', (SELECT quantity FROM products WHERE item_id = '"+itemId+"'), (SELECT max_bid FROM products WHERE item_id = '"+itemId+"'), '');";
						var delFromProducts = "DELETE FROM products WHERE item_id = '"+itemId+"'";
						mysql.runQuery(function(err,result){
							if(!err)
							{
								mysql.runQuery(function(err,results){
									if(!err)
									{
										mysql.runQuery(function(err,result){
											if(!err)
											{
												log.info("Cron job executed for Item ID: "+itemId+" for timestamp: "+fixedFinaldate);
												console.log("Job Executed!!");
											}
										},delFromProducts);
									}
								},updatePurchaseInfo);
							}
						},updateSellingInfo);
					}.bind(null,tempBindVar));
				}
				//var createEvent = "CREATE EVENT "+maxBidder+"_"+itemId+" ON SCHEDULE AT '"+year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second+"' DO BEGIN  END               ";
				//create logic for event-- pending
				json_responses = {"statusCode" : 200};
				
				res.send(json_responses);
			}
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	},insertProduct);


*/

}

exports.handle_request = handle_request;