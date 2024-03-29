// Initialize your app
var myApp = new Framework7({
	swipePanel : 'left',
});

// Export selectors engine
var $$ = Dom7;

$$('.profile-auth').on('click', function() {
	if (localStorage.getItem('userToken')) {
		mainView.router.loadPage('profile.html');
	}
});
// Add view
var mainView = myApp.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar : true
});
if (Modernizr.localstorage) {
	// window.localStorage is available!
	if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
		$$("#profiletrigger").prop('href', 'profile.html');
	} else {
		$$("#profiletrigger").prop('href', 'loginaws.html');
	}
} else {
	// no native support for HTML5 storage :(
	// maybe try dojox.storage or a third-party solution
}
$$('.panel-left').on('open', function() {
	$$('.navicon-button').addClass('open');
});
$$('.panel-left').on('close', function() {
	$$('.navicon-button').removeClass('open');
});


myApp.onPageInit('index', function(page) {
	$$('.profile-auth').on('click', function() {
		if (localStorage.getItem('userToken')) {
			mainView.router.loadPage('profile.html');
		}
	});
	$$('.ac-1').on('click', function() {
		var buttons1 = [{
			text : 'Settings',
			bold : true
		}, {
			text : 'Sign out',
			onClick : function() {
				localStorage.removeItem('token');
				userProfile = null;

				localStorage.clear();
				$$("#profiletrigger").prop('href', 'loginaws.html');
				myApp.alert('Successfully Logged Out', 'FitnessTime', function() {
					mainView.router.load('index');
				});
			}
		}];
		var buttons2 = [{
			text : 'Cancel',
			color : 'red'
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	});

});


myApp.onPageInit('photo2gallery', function(page) {
	var mySwiper = myApp.swiper('.swiper-container', {
		pagination : '.swiper-pagination'
	});
});


myApp.onPageInit('photo1gallery', function(page) {
	var mySwiper = myApp.swiper('.swiper-container', {
		pagination : '.swiper-pagination'
	});
});


myApp.onPageInit('register', function(page) {
	$('.gym-member').attr('checked', true);
	$('.gym-member').on('click', function fireMemberID() {
		if ($('.gym-member').prop("checked") == true) {
			$('.member-id').removeClass("show-memberid");

		} else if ($('.gym-member').prop("checked") == false) {
			$('.member-id').addClass("show-memberid");
		}
	});

		var params = {
			AccountId : '710983978180', // AWS account Id
			RoleArn : 'arn:aws:iam::710983978180:role/Cognito_FitnessTimeIPUnauth_Role', // IAM role that will be used by authentication
			IdentityPoolId : 'us-east-1:590028b9-2e47-4112-88ad-90c6c77b6e60', //ID of the identity pool

		};

		//Initialize the Credentials object
		AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
		AWS.config.region = 'us-east-1';
		//Call to Amazon Cognito, get the credentials for our user
		AWS.config.credentials.get(function(err, data) {
			if (err) {
				console.log("Error: " + err);
				return;
			}
			console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
		});
/*

 	cognitosync = new AWS.CognitoSync();

		cognitosync.listRecords({
			DatasetName : "COGNITO_DATASET_NAME", //Name of the dataset
			IdentityId : AWS.config.credentials.identityId, //Cognito ID of the user
			IdentityPoolId : 'us-east-1:590028b9-2e47-4112-88ad-90c6c77b6e60' //Cognito identity pool ID
		}, function(err, data) {
			if (!err) {
				//Store dataset metadata and SyncSessionToken in the user’s session
				//for subsequent calls to the API where it is required.
				req.user.COGNITO_SYNC_TOKEN = data.SyncSessionToken;
				req.user.COGNITO_SYNC_COUNT = data.DatasetSyncCount;

				//Retrieve information on the dataset
				var dataRecords = JSON.stringify(data.Records);
				console.log(dataRecords);
			}
		});
*/	
AWS.config.credentials.get(function(){

   var syncClient = new AWS.CognitoSyncManager();

   syncClient.openOrCreateDataset('myDataset', function(err, dataset) {

      dataset.put('myKey', 'myValue', function(err, record){

         dataset.synchronize({

            onSuccess: function(data, newRecords) {
                console.log("cognito succeeded");
            }

         });

      });
     
   });

});

$$('.form-to-json').on('click', function() {
			console.log("you clicked me");
			registerUser();
		});
		
function registerUser() {
	AWS.config.region = 'us-west-2';
		var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
		var table = "fitness_users";

		var useremail = $("input[name='email']").val();
		var password = $("input[name='password']").val();
		var shahash = $.sha256('password');
		var name = $("input[name='name']").val();
		var memberid = $("input[name='memberid']").val() + "0";
		var birthdate = $("input[name='birthdate']").val();
		
		
	
		var params = {
			TableName : table,
			Item : {
				"useremail" : useremail,
				"password" : shahash,
				"name" : name,
				"birthdate" : birthdate,
				"memberID" : memberid,
			}
		};
		console.log("Adding a new item...");
console.log(useremail);
console.log(name);
		dynamodbDoc.put(params, function(err, data) {
			if (err) {
				console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
				alert("One or more input values were invalid/empty.");

			} else {
				console.log("Added item:", JSON.stringify(data, null, 2));
				alert("Registration complete! You can now login and view your profile.");
				mainView.router.load('profile.html');
			}
		});
	};

});


myApp.onPageInit('loginaws', function(page) {
	var pageContainer = $$(page.container);
	if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
		console.log("LocalStorageIsActive");
		mainView.router.load('profile.html');
	}

	$$('#loginButton').on('click', function() {
		veriefyUser();
	});
	function veriefyUser() {

		var userName = $("input[name='username']").val();
		var passWord = $("input[name='password']").val();
		var hashPassword = $.sha256('passWord');
		var apigClient = apigClientFactory.newClient({
			apiKey : '9MG65fI2j99RkOr9AHzND3OcI0ofRzWM3MxDU6vJ'
		});
		var params = {
			// This is where any modeled request parameters should be added.
			// The key is the parameter name, as it is defined in the API in API Gateway.

		};
		var body = {
			useremail : userName,
			password : hashPassword
		};
		var additionalParams = {
			// If there are any unmodeled query parameters or headers that must be
			//   sent with the request, add them here.
			headers : {
			},
			queryParams : {
			}
		};
		apigClient.authLambdaPost(params, body, additionalParams).then(function(result) {
			alert('Login Successful! We are still building the profile page please come back later');
			mainView.router.loadPage('profile.html');

		}).catch(function(result) {
			alert('Login Failed');

		});
	}


	myApp.onPageInit('profile', function(page) {
		var username = window.localStorage["username"];
		$('.usertitle').text("Welcome " + username);
	});

});
var showme = localStorage.getItem('userToken');
console.log(showme);


myApp.onPageInit('auth0', function(page) {
	var userProfile;
	var showme = localStorage.getItem('userToken');
	console.log(showme);

	if (localStorage.getItem('userToken')) {
		mainView.router.loadPage('profile.html');
	} else {
		var lock = null;

		lock = new Auth0Lock('3FpYC7YilWG7nCwduKkfwAbtckCWqV6W', 'bmzapps.auth0.com');

		lock.show({}, function(err, profile, token) {
			if (err) {
				// Error callback
				alert('There was an error');
			} else {
				// Success callback
				mainView.router.loadPage('profile.html');
				// Save the JWT token.
				localStorage.setItem('userToken', token);
				// Save the profile
				userProfile = profile;
			}
		});
	}
});
