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

app.controller("allProducts", function($scope,$http){
	$scope.error = true;
	$scope.success = true;
	$scope.allProductsInStock=[];
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
	};
});