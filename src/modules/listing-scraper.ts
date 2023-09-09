import {parse} from 'node-html-parser';
import {getDocument} from "../services/requests";
import {logger} from "../app";
import franc from "franc";
import {db} from "../database/db";

export async function searchListings() {
    const filterPage = await getDocument(process.env.FILTER_URL);
    const newListings = await parseListings(filterPage);
    addListingsToDB(newListings);
}

function addListingsToDB(listings: Listening[]) {
    let countListings = listings.length;
    db.read();
    listings.forEach((listing) => {
        const listingExists = db.get("listings").find(value => value.id == listing.id).value();
        if (listingExists) {
            countListings--;
        } else {
            db.get("listings").push(listing);
        }
    });
    db.write();
    if (countListings === 0) {
        logger.info('No new listings!');
    } else {
        logger.info(`Adding ${countListings} new listings...`);
    }
}

async function parseListings(document: string) {
    logger.info('Looking for new listings...');
    const allListings: Listening[] = [];
    
    for (const listingHTML of parse(document)
        .querySelectorAll('.wgg_card.offer_list_item')) {
            const id = listingHTML.attrs.id.replace("liste-details-ad-", "");
            // for message to have appropiate owner name
            let owner =
                listingHTML.querySelector("span.ml5")?.rawText.replace(/ .*/, "") || "";
            if (owner.charAt(0) === "\n") {
                owner = "";
            }

            const titleHTML = listingHTML.querySelector(
                "h3.truncate_title.noprint > a"
            );
            const url = process.env.BASE_URL + titleHTML.attrs.href;
            const title = titleHTML.rawText || "";
            const description = await parseDescription(url); // new page must be opened to parse description
            const lang = franc(title, { only: ["eng", "deu"] });

            const listing: Listening = {
                id: id,
                owner: owner,
                url: url,
                title: title,
                description: description,
                lang: lang,
                message: {
                    messageSent: false,
                    content: "",
                },
            };

            allListings.push(listing);
        }
    return allListings;
}

async function parseDescription(listingUrl: string) {
    const document = await getDocument(listingUrl);

    /* TBD – add to object */
    return "Unknown description"
}