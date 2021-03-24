import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMIddleWare';
import getAuctionsSchema from '../../lib/schemas/getAuctionsSchema';
import validator from '@middy/validator';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
   let auctions = [];
   const { status } = event.queryStringParameters;

   if(status) {
       const params = {
           TableName: process.env.AUCTIONS_TABLE_NAME,
           IndexName: 'statusAndEndDate',
           KeyConditionExpression: '#status = :status',
           ExpressionAttributeNames: {
               '#status': 'status'
           },
           ExpressionAttributeValues: {
               ':status': status,
           }
       };

       try {
           const result = await dynamoDB.query(params).promise();
           auctions = result.Items;
       }catch (e) {
           console.error(e);
           throw new createHttpError.InternalServerError(e);
       }
   } else {
       try {
           const result = await dynamoDB.scan({TableName: process.env.AUCTIONS_TABLE_NAME,}).promise();
           auctions = result.Items;
       }catch (e) {
           console.error(e);
           throw new createHttpError.InternalServerError(e);
       }
   }


    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions).use(validator({inputSchema: getAuctionsSchema}));


