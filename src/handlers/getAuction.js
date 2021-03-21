import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMIddleWare';
import createHttpError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getAuctionById = async (id) => {
    let auction = null;


    try {
        const result = await dynamoDB.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();
        auction = result.Item;
    } catch (e) {
        console.error(e);
        throw new createHttpError.InternalServerError(e);
    }

    if(!auction) {
        throw new createHttpError.NotFound(`item with id equals ${id} not found!!!`);
    }

    return auction;
}


async function getAuction(event, context) {
    const { id } = event.pathParameters;

    const auction = await getAuctionById(id);

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction);


