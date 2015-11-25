var express = require('express'),
    http = require('http'),
    path = require('path'),
    crypto = require('crypto'),
    app = express(),
    bucket = "testappfitness",
    awsKey = "AKIAJXIPNX5ZILPIM35A",
    secret = "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";
 
app.use(express.logger("dev"));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
 
function sign(req, res, next) {
 
    var fileName = req.body.fileName,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
 
    var policy =
    { "expiration": expiration,
        "conditions": [
            {"bucket": bucket},
            {"key": fileName},
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 524288000]
        ]};
 
    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});
 
}
 
// DON'T FORGET TO SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
app.post('/signing', sign);
 
app.listen(3000, function () {
    console.log('Server listening on port 3000');
});