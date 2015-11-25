
(function() {
    AWS.config.update({
        accessKeyId: "AKIAJXIPNX5ZILPIM35A",
        secretAccessKey: "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"
    });
    
AWS.config.region = 'us-west-2';

var table = "fitness_users";
var key = 'userID';

// Write the item to the table

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var name = "Bill";
var password = "password";

var params = {
    TableName:table,
    Item:{
    	"userID":key,
        "name": name,
        "password": password
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
 
  })();