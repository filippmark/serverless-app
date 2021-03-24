import {getEndedAuctions} from "../../lib/getEndedAuctions";
import {closeAuction} from "../../lib/closeAuction";
import createHttpError from "http-errors";

async function processAuctions(event, context) {

    try {
        const auctions = await getEndedAuctions();
        const closedAuctions = await Promise.all(auctions.map((auction) => {
            return closeAuction(auction);
        }));
        return { amountOfClosedAuctions: closedAuctions.length };
    } catch (e) {
        console.error(e);
        throw new createHttpError.InternalServerError();
    }
}

export const handler = processAuctions;


