import { logger, getAllContacts } from "../index.js";
import { buildMomentumContactPayload } from "../utils/helper.js";
import { getContactsModifiedLast1Hour } from "../service/momentum.service.js";
import { getAccessToken } from "../service/momentum.service.js";
import { createContactInMomentum } from "../service/hubspot.js";
import { searchContractBySourceId } from "../service/momentum.service.js";
import { getAssociatedCompanyByContactId } from "../service/hubspot.js";
import { updateContactById } from "../service/momentum.service.js";
import { getCompanyById } from "../service/momentum.service.js";
import { fetchContactsWithSourceGroup } from "../service/momentum.service.js";
import { insertInsuredContact } from "../service/momentum.service.js";
import { searchLifestageContacts } from "../service/momentum.service.js";
import { SearchProspectsMomentum } from "../service/momentum.service.js";
import { insertProspectInMomentum } from "../service/momentum.service.js";
import{buildProspectsPayload} from "../utils/helper.js"

async function syncProspectContact() {
  try {
    const accessToken = await getAccessToken();

    //
    const lifestageContacts = await searchLifestageContacts();
    logger.info(
      `Lifestage Contacts:${JSON.stringify(lifestageContacts.length)}`,
    );

    // return; //todo remove after testing

    for (const contact of lifestageContacts) {

      try {
        const lifecycleStage = contact.properties?.lifecyclestage;

        // Skip if no lifecycle stage
        if (!lifecycleStage) continue;
        // Only process required stages
        if (
          lifecycleStage === "MQL" ||
          lifecycleStage === "SQL" ||
          lifecycleStage === "opportunity"
        ) {
          logger.info(
            `Processing contact ${JSON.stringify(contact, null, 2)} | Stage: ${lifecycleStage}`,
          );

          // Build payload 
          const payload = buildProspectsPayload(contact);
          logger.info(
            `Prospect Payload:${JSON.stringify(payload, null, 2)}`,
          );

          // Update and Create Prospect
          const prospect = await insertProspectInMomentum(payload, accessToken);
          logger.info(
            ` prospect in Momentum ${JSON.stringify(prospect, null, 2)}`,
          );

          break; // todo remove after testing
        }
      } catch (error) {
        console.error(`Error syncing Contact ID ${contact}:`, error);
      }
    }
    logger.info(" ☘️ All Prospect synced successfully.");
  } catch (error) {
    logger.error(`❌ Error fetching customers:`, error);
  }
}

export { syncProspectContact };
