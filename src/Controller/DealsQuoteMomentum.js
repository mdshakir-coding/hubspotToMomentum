

import { logger,  } from "../index.js";
import{getAllHubSpotDeals}from "../service/hubspot.js"






async function syncDealsQuoteMomentum() {
  try {
    // call The Deal function in Hubspot

    const deals = await getAllHubSpotDeals();
    logger.info(
      `All Deals:${JSON.stringify(deals.length)}`,
    );
    logger.info (`Deal ${JSON.stringify(deals[0], null,2 )}`)
    // return; // todo remove after testing

    // Search Quote Function in momentum based on SourceGroupId 





  } catch (error) {
    logger.error("Error syncing DealsQuoteMomentum:", error);
  }
}

export { syncDealsQuoteMomentum };
