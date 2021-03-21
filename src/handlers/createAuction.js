import { v4 } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMIddleWare';
import createHttpError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;

  const item = {
    id: v4(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    highestBid: {
        amount: 0,
    },
  };

  try {
       await dynamoDB.put({
          TableName: process.env.AUCTIONS_TABLE_NAME,
          Item: item,
      }).promise();
  }catch (e) {
      console.error(e);
      throw new createHttpError.InternalServerError(e);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
}

export const handler = commonMiddleware(createAuction);


