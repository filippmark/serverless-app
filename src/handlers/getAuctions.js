import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMIddleWare';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
   let auctions = [];

    try {
        const result = await dynamoDB.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME
        }).promise();
        auctions = result.Items;
    }catch (e) {
        console.error(e);
        throw new createHttpError.InternalServerError(e);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions);


