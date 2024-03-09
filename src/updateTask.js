const AWS = require('aws-sdk');

const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser');

const updateTask = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { id } = event.pathParameters;

        const { title, description, done } = event.body;

        const updatedTask = await dynamodb.update({
            TableName: 'TaskTable',
            Key: { id },
            UpdateExpression: 'set title = :title, description = :description, done = :done',
            ExpressionAttributeValues: {
                ':title': title,
                ':description': description,
                ':done': done
            },
            ReturnValues: 'ALL_NEW'
        }).promise();
    
        return {
            status: 200,
            body: { 
                message: 'Task updated successfully!',
                updatedTask: updatedTask.Attributes
            }
        }
    } catch(error) {
        console.log(error);
    }
};

module.exports = { 
    updateTask: middy(updateTask).use(jsonBodyParser())
 };