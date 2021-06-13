const AWS = require("aws-sdk");

AWS.config.update({
    region: 'ap-south-1'
});

module.exports = {
    AWS: AWS,
    STS: new AWS.STS(),
    SF: new AWS.StepFunctions(),
    documentClient: new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' }),
    SNS: new AWS.SNS({ apiVersion: '2010-03-31' }),
    S3: new AWS.S3()
}