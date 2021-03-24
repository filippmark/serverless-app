import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMIddleWare';
import createHttpError from "http-errors";
import {getAuctionById} from "./getAuction";
import createBidSchema from '../../lib/schemas/createBidSchema';
import validator from "@middy/validator";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const auction = await getAuctionById(id);

    if(auction.status === 'OPEN') {
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
    } else {
        throw new createHttpError.BadRequest('could not add bid for closed auction');
    }

}

export const handler = commonMiddleware(placeBid).use([validator({inputSchema: createBidSchema})]);


