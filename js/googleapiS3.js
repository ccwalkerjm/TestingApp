 var s3 = null;
  var clientID = '11269715807-3nqm3eib7s1ehvvbuglgd0s9k7rf4ml6.apps.googleusercontent.com'; // Google client ID
  var roleArn = 'arn:aws:iam::710983978180:role/googleAPI';
AWS.config.region = 'us-west-2';
  document.getElementById('login').setAttribute('data-clientid', clientID);
  function loginToGoogle(response) {
    if (!response.error) {
      AWS.config.credentials = new AWS.WebIdentityCredentials({
        RoleArn: roleArn, WebIdentityToken: response.id_token
      });

      s3 = new AWS.S3();
      
var bucket = new AWS.S3({params: {Bucket: 'testappfitness'}});
  bucket.listObjects({}, function (err, data) {
    if (err) {
      document.getElementById('status').innerHTML =
        'Could not load objects from S3';
    } else {
    	console.log(data);
      document.getElementById('status').innerHTML =
        'Loaded ' + data.Contents.length + ' items from S3';
      for (var i = 0; i < data.Contents.length; i++) {
        document.getElementById('objects').innerHTML +=
          '<li>' + data.Contents[i].Key + '</li>';
      }
    }
  });

      console.log('You are now logged in.');
    } else {
      console.log('There was a problem logging you in.');
    }

  }

    
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
 
  