import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMIddleWare';
import createHttpError from "http-errors";
import {getAuctionById} from "./getAuction";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const auction = await getAuctionById(id);

    if(auction.highestBid.amount < amount) {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set highestBid.amount = :amount',
            ExpressionAttributeValues: {
                ':amount': amount,
            },
            ReturnValues: 'ALL_NEW',
        };

        console.log(params);

        let updatedAuction = null;

        try {
            const result = await dynamoDB.update(params).promise();
            updatedAuction = result.Attributes;
        } catch (e) {
            console.error(e);
            throw new createHttpError.InternalServerError(e);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction),
        };
    } else {
        throw new createHttpError.Forbidden('new bid should be bigger');
    }
}

export const handler = commonMiddleware(placeBid);


