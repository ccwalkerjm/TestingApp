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
	$$("#profiletrigger").prop('href', 'loginpage.html');
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
            $$("#profiletrigger").prop('href', 'loginpage.html');
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
    	
    	$('.gym-member').on('click', function fireMemberID() {
if ($('.gym-member').prop( "checked" ) == true) {
	console.log("true");
	$('div .item-content.member-id').css("display", "flex");
  
}
else if ($('.gym-member').prop( "checked" ) == false) {
	$('div .item-content.member-id').hide();
	console.log("false");
}
});

$$('.form-to-json').on('click', function(){

  registerUser();
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
var memberid = $("input[name='memberid']").val();
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
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});

}
  }); 


myApp.onPageInit('loginaws', function (page) {
	
	$$('#loginButton').on('click', function(){
	veriefyUser();
	});
	function veriefyUser(){
	
	var userName = $("input[name='username']").val();
var passWord = $("input[name='password']").val();

	var apigClient = apigClientFactory.newClient({
    apiKey: '9MG65fI2j99RkOr9AHzND3OcI0ofRzWM3MxDU6vJ'
});
var params = {
  // This is where any modeled request parameters should be added. 
  // The key is the parameter name, as it is defined in the API in API Gateway.

};
var body = {
    useremail: userName,
        password: passWord
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
        alert('success');
    }).catch( function(result){
         alert('failed');
    });
    }
  });
  
  myApp.onPageInit('loginpage', function (page) {

 var pageContainer = $$(page.container);
if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
	console.log("LocalStorageIsActive");
mainView.router.load('profile.html'); 
}

  pageContainer.find('.list-button').on('click', function fireLogin() {
    var username = pageContainer.find('input[name="username"]').val();      // read username input
    var password = pageContainer.find('input[name="password"]').val();      // read password input
     username = username.replace(/[^\w\s]/gi, '');    // sanitizing username input
     $('input[name="username"]').val(username);

$$("#loginbutton").attr("disabled","disabled");
if(username != '' && password != '') {
	var apikey =  "MAQFMSFD29RG4R1LM48K";                 // defining apikey which is stored on the remote server
	var url = "http://www.fitnesstime-lb.org/testrest/post/user/login?username="+username+"&password="+password+"&api_key="+apikey;
	$$.post(url, function (json) {                    //using post method to parse json result and remote server is set to ignore GET request
var checkstatus = json[11] + json[12];                // this will return ok only if login is correct otherwise it's ko
var checkusername = [];                                // array to store useful json response
var prePopulate = $.parseJSON(json);
$.each(prePopulate, function(idx2,val2) {              // parsing json response into a fine array
	var str = idx2 + ":" + val2;
	checkusername.push(str);
});

if (checkstatus == "ok" && checkusername[2] == "username:"+username){ //comparing to check if status return is ok and username return matahces
window.localStorage["username"] = username;                                    // store username in localstorage
window.localStorage["password"] = password;                                    // store password in localstorage
mainView.router.loadPage('profile.html');                                 // will navigate user to protected page
}
else{
	myApp.alert("Username and/or Password do not match. Please try again.",'FitnessTime', function() {});      
}
});

}
else {
   
	myApp.alert("Please enter username and password", 'FitnessTime', function() {});           // if username or password left empty
}
return false;
});
	
  	 myApp.onPageInit('profile', function (page) {
var username = window.localStorage["username"];
$('.usertitle').text("Welcome "+username);
  });

  		
          });

  
