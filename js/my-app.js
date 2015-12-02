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



$$('.form-to-json').on('click', function(){
$("#my-form").validate();
if ($("input[name='email']").val() != "" && $("input[name='password']").val() != "" && $("input[name='name']").val()!="" && $("input[name='birthdate']").val() !="" ){
  registerUser();
 }
}); 
  function registerUser(){
AWS.config.update({
    	accessKeyId: 'AKIAJ7GE5M52PMLG5QTQ',
    	secretAccessKey: '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',
  region: "us-west-2"
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
        alert("Registration complete! You can now login and view your profile.")
    }
});

}
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
var username = window.localStorage["username"];
$('.usertitle').text("Welcome "+username);
  }); 	 

  });

  
