// Initialize your app
var myApp = new Framework7({
    swipePanel: 'left', 
    
      
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


if (Modernizr.localstorage) {
  // window.localStorage is available!
  if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
$$("#profiletrigger").prop('href', 'profile.html');

}
else{
	$$("#profiletrigger").prop('href', 'loginaws.html');
}
} else {
  // no native support for HTML5 storage :(
  // maybe try dojox.storage or a third-party solution
}
$$('.ac-1').on('click', function () {
    var buttons1 = [
        {
            text: 'Settings',
            bold: true
        },
        {
            text: 'Sign out',
            onClick: function () {
            	localStorage.removeItem('token');
userProfile = null;
window.location.href = "/";
            localStorage.clear();
            $$("#profiletrigger").prop('href', 'loginaws.html');
            myApp.alert('Successfully Logged Out','FitnessTime', function () {
      mainView.goBack();
    });
            }
        }
    ];
    var buttons2 = [
        {
            text: 'Cancel',
            color: 'red'
        }
    ];
    var groups = [buttons1, buttons2];
    myApp.actions(groups);
});

$$('.panel-left').on('open', function () {
  $$('.navicon-button').addClass('open');
});
$$('.panel-left').on('close', function () {
    $$('.navicon-button').removeClass('open');
});
myApp.onPageInit('photo2gallery', function (page) {
var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
  });
  });
  myApp.onPageInit('photo1gallery', function (page) {
var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
  });
  });
    myApp.onPageInit('register', function (page) {
    	$('.gym-member').attr('checked', true);
    	$('.gym-member').on('click', function fireMemberID() {
if ($('.gym-member').prop( "checked" ) == true) {
	$('div .item-content.member-id').removeClass("show-memberid");
  
}
else if ($('.gym-member').prop( "checked" ) == false) {
	$('div .item-content.member-id').addClass("show-memberid");
}
});
 
var params = {
    AccountId: '710983978180', // AWS account Id
    RoleArn: 'arn:aws:iam::710983978180:role/lambda_dynamo', // IAM role that will be used by authentication
    IdentityPoolId: 'us-east-1:590028b9-2e47-4112-88ad-90c6c77b6e60', //ID of the identity pool
    Logins: {
        'accounts.google.com': '11269715807-3nqm3eib7s1ehvvbuglgd0s9k7rf4ml6.apps.googleusercontent.com' //Token given by Amazon
        }
};
     
//Initialize the Credentials object
AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
 
//Call to Amazon Cognito, get the credentials for our user
AWS.config.credentials.get(function(err,data) {
    if (err) {
        console.log("Error: "+err);
        return;
    }
    console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
});
cognitosync = new AWS.CognitoSync();

cognitosync.listRecords({
    DatasetName: COGNITO_DATASET_NAME, //Name of the dataset 
    IdentityId: COGNITO_IDENTITY_ID, //Cognito ID of the user
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID //Cognito identity pool ID
}, function(err, data) {
    if ( !err ) {
        //Store dataset metadata and SyncSessionToken in the user’s session 
        //for subsequent calls to the API where it is required.
        req.user.COGNITO_SYNC_TOKEN = data.SyncSessionToken;
        req.user.COGNITO_SYNC_COUNT = data.DatasetSyncCount;
 
        //Retrieve information on the dataset
        var dataRecords = JSON.stringify(data.Records);
    }
});



var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
  var table = "fitness_users";

var useremail = $("input[name='email']").val();
var password = $("input[name='password']").val();
var shahash = $.sha256('password');
var name = $("input[name='name']").val();
var memberid = $("input[name='memberid']").val() + "0";
var birthdate = $("input[name='birthdate']").val();

var params = {
    TableName:table,
    Item:{
        "useremail": useremail,
        "password": shahash,
        "name": name ,
        "birthdate": birthdate,
        "memberID": memberid,
    }
};
  console.log("Adding a new item...");
dynamodbDoc.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        alert("One or more input values were invalid/empty.");
        
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        alert("Registration complete! You can now login and view your profile.");
    }
 }); 
    
    
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
 

 

  }); 
myApp.onPageInit('loginaws', function (page) {
	 var pageContainer = $$(page.container);
if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
	console.log("LocalStorageIsActive");
mainView.router.load('profile.html'); 
}
	
	$$('#loginButton').on('click', function(){
	veriefyUser();
	});
	function veriefyUser(){
	
	var userName = $("input[name='username']").val();
var passWord = $("input[name='password']").val();
var hashPassword = $.sha256('passWord');
	var apigClient = apigClientFactory.newClient({
    apiKey: '9MG65fI2j99RkOr9AHzND3OcI0ofRzWM3MxDU6vJ'
});
var params = {
  // This is where any modeled request parameters should be added. 
  // The key is the parameter name, as it is defined in the API in API Gateway.

};
var body = {
    useremail: userName,
        password: hashPassword
};
var additionalParams = {
  // If there are any unmodeled query parameters or headers that must be 
  //   sent with the request, add them here.
  headers: {
  },
  queryParams: {
  }
};
apigClient.authLambdaPost(params, body, additionalParams)
    .then(function(result){
        alert('Login Successful! We are still building the profile page please come back later');
        mainView.router.loadPage('profile.html');     
        
    }).catch( function(result){
         alert('Login Failed');
         
    });
    }
      myApp.onPageInit('profile', function (page) {
      	var url = window.location.href;
      	alert(url);
var username = window.localStorage["username"];
$('.usertitle').text("Welcome "+username);
  }); 	 

  });

myApp.onPageInit('auth0', function (page) {

var lock = null;
store.set('path', window.location.pathname);

   lock = new Auth0Lock('3FpYC7YilWG7nCwduKkfwAbtckCWqV6W', 'bmzapps.auth0.com');
 
    lock.show({
        closable: false,
         responseType: 'token',
         callbackURL: 'https://s3-us-west-2.amazonaws.com/testappfitness/profile.html'
      });


var userProfile;

$('.btn-login').click(function(e) {
	console.log("you clicked me");
  e.preventDefault();
  lock.show(function(err, profile, token) {
    if (err) {
      // Error callback
      alert('There was an error');
    } else {
      // Success callback
 alert('login succes');
      // Save the JWT token.
      localStorage.setItem('userToken', token);
 alert(profile);
      // Save the profile
      userProfile = profile;
    }
    
    $.ajax({
    type: "POST",
    url: "https://bmzapps.auth0.com/delegation",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify({ "client_id": "3FpYC7YilWG7nCwduKkfwAbtckCWqV6W","grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer","id_token":token,"target": "3FpYC7YilWG7nCwduKkfwAbtckCWqV6W",
    "api_type":"aws","role": "arn:aws:iam::710983978180:role/auth0-role","principal": "arn:aws:iam::710983978180:saml-provider/Auth0-fitnesstime"}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){alert(data);},
    failure: function(errMsg) {
        alert(errMsg);
    }
}); 
    



});
});

$.ajaxSetup({
  'beforeSend': function(xhr) {
    if (localStorage.getItem('userToken')) {
    	console.log("usertoken already stored");
      xhr.setRequestHeader('Authorization',
            'Bearer ' + localStorage.getItem('userToken'));
    }
  }
});

 
  }); 
  myApp.onPageInit('profile', function (page) {
  	
  	$$('.test-button').on('click', function () {
  		var url      = window.location.href;
  		alert(url);
   }); 
      }); 