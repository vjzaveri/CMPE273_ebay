var app = angular.module("mainApp", ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider

	.when('/',{
		templateUrl : 'Pages/login.ejs'
	})

	.when('/signUp',{
		templateUrl : 'Pages/signUp.ejs'
	})

	.when('/sellItem', {
		templateUrl : 'Pages/sellItem.ejs'
	})

	.when('/allProducts',{
		templateUrl : 'Pages/allProducts.ejs'
	})

	.when('/checkoutAddress',{
		templateUrl : 'Pages/checkoutAddress.ejs'
	})

	.when('/payment',{
		templateUrl : 'Pages/payment.ejs'
	})
});

app.controller("loginController", function($scope,$http,$location){
	
	$scope.error = true;
	$scope.success = true;
	$scope.login = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.success = false;
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};

	$scope.signUp = function(){
		$location.path('signUp');
	}
});


app.controller("newAccountController", function($scope,$http,$location){

	$scope.error = true;
	$scope.success = true;
	$scope.createAccount = function() {
		$http({
			method : "POST",
			url : '/newUser',
			data : {
				"username" : $scope.username,
				"password" : $scope.password,
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.success = false;
					alert("Account Created. Redirecting you to Login Page");
					$location.path('');
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};
});

app.controller("sellItem", function($scope,$http){

	$scope.error = true;
	$scope.success = true;
	$scope.postForSell = function() {
		$http({
			method : "POST",
			url : '/sellItem',
			data : {
				"itemName" : $scope.itemName,
				"itemDescription" : $scope.itemDescription,
				"itemPrice" : $scope.itemPrice,
				"quantity" : $scope.quantity,
				"buyNow" : $scope.buyNow,
				"initialBidding" : $scope.initialBidding
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.success = false;					
					//$location.path('');
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};
});

app.controller("allProducts", function($scope,$http,$location){
	$scope.error = true;
	$scope.success = true;
	$scope.allProductsInStock=[];
	$scope.cartError = true;

	$scope.getCart = function(){
		$http({
			method : "POST",
			url : '/getCart',
			data : {
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.shoppingCart = data.shoppingCartProducts;
					$scope.success = false;	
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};

	init();

	function init() {
		$http({
			method : "GET",
			url : '/displayAllProducts',
			data : {
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.success = false;	
					//for(var i=0;i<data.allProducts.length;i++)
					//{
					//	$scope.allProductsInStock.push(data.allProducts[i]);
					//}
					$scope.allProductsInStock=data.allProducts;				
					//$location.path('');
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});

		$scope.getCart();
	};


	$scope.addToCart = function(product){
		$scope.selectedItem = product.item_id;
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"itemId" : $scope.selectedItem
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.getCart();
					$scope.success = false;	
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};

	$scope.removeFromCart = function(cartId){
		$scope.temp = cartId;
		$http({
			method : "POST",
			url : '/removeFromCart',
			data : {
				"cartId" : $scope.temp,
				"temp" : $scope.temp
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.getCart();
					$scope.success = false;	
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	}

	$scope.checkout = function(){
		$location.path('/checkoutAddress');

/**		$http({
			method : "POST",
			url : '/checkoutShoppingCart',
			data : {
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else if(data,statusCode == 400){
				$scope.notAvailableItems = data.result;
				$scope.cartError = false;
			}
			else
			{
				$scope.success = false;
				$location.path('/checkoutAddress');
			}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	}
*/
	};

});

app.controller("checkoutAddress",function($scope,$http,$location){
	$scope.success = true;
	init();

	function init(){
		$http({
			method : "POST",
			url : '/checkoutAddress',
			data : {
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.success = false;	
					$scope.userAddress = data.userDetails[0];
					$scope.address = $scope.userAddress.address;
					$scope.city = $scope.userAddress.city;
					$scope.state = $scope.userAddress.state;
					$scope.country = $scope.userAddress.country;
					$scope.zip = $scope.userAddress.zip;
					$scope.cellNum = $scope.userAddress.cellphone_number;
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};

	$scope.editAddress = function(){
		$http({
			method : "POST",
			url : '/editAddress',
			data : {
				"address" : $scope.address,
				"city" : $scope.city,
				"state" : $scope.state,
				"country" : $scope.country,
				"zip" : $scope.zip,
				"cellNum" : $scope.cellNum
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					$scope.success = false;	
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	};

	$scope.toPayment = function(){

		$location.path('/payment');
	}
});

app.controller("paymentController",function($scope,$http){

	$scope.finalPage = function(){
		$scope.cardNumber;
		$http({
			method : "POST",
			url : '/payAndPurchase',
			data : {
				"cardNumber" : $scope.cardNumber
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = false;
			}
			else
				{
					//$scope.getCart();
					$scope.success = false;	
				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.error = false;
		});
	}
});