import { logger, getAllContacts } from "../index.js";
import { buildMomentumContactPayload } from "../utils/helper.js";
import { getContactsModifiedLast1Hour } from "../service/momentum.service.js";
import { getAccessToken } from "../service/momentum.service.js";
import { createContactInMomentum } from "../service/hubspot.js";
import { searchContractBySourceId } from "../service/momentum.service.js";
import { getAssociatedCompanyByContactId } from "../service/hubspot.js";
import { updateContactById } from "../service/momentum.service.js";
import { getCompanyById } from "../service/momentum.service.js";

// sync contacts in momentum

async function syncContactMomentum() {
  try {
    // call the function

    // const contacts = await getAllContacts();
    // logger.info("final Contacts:", contacts.length);
    // logger.info("final Contacts:", contacts[0]);
    // return;

    // call the Token
    const accessToken = await getAccessToken();

    // caal the function
     const contacts = await getContactsModifiedLast1Hour();
    logger.info("final Contacts:", contacts.length);
    //  logger.info ("final Contacts:", contacts[0]);
     logger.info (`Contact ${JSON.stringify(contacts[0], null,2 )}`)
    //  return; //todo remove after testing

    for (const contact of contacts) {
      try {
        // search based Contacts id

        // if (contact?.id !== "101100491877") {
        //   // skip other contacts
        //   continue;
        // }
        // logger.info("Processing Contact:", contact);
        // return;

        if (contact.properties?.sync_to_momentum === "No" || contact.properties?.sync_to_momentum === null
          || contact.properties?.sync_to_momentum === undefined ) {
            logger.info ("Sync To momentum is no for Contact " , contact);
            continue;
          }

        // logger.info("Contact ID:", contact);
        // return;
        // search based on sorceid if exist continue
        const existingContact = await searchContractBySourceId(
          contact?.properties?.sourceid
        );

        if (existingContact) {
          logger.info(
            "Contact already exists in Momentum:",
            existingContact.id
          );
          continue;
        }
        
        // search associated company

        const associatedCompany = await getAssociatedCompanyByContactId(
          contact.id
        );
      
        logger.info(`Associated Company ${JSON.stringify(associatedCompany, null,2 )}`)
        if (!associatedCompany) {
          logger.info(`No associated company found for contact ID:${contact.id}`);
          continue;
        }
       
        
        let company = null;

        if (associatedCompany.id) {
          company = await getCompanyById(associatedCompany.id);
          logger.info(`Company ${JSON.stringify(company, null,2 )}`);
        }
        logger.info("Contact:", contact);
        const contactPayload = buildMomentumContactPayload(contact, company);
        logger.info(` Contact Payload ${JSON.stringify(contactPayload,null,2)}`);
        
        let contactMomentum = null;
        // // ✅ Create Contact in Momentum
        contactMomentum = await createContactInMomentum(contactPayload,accessToken);
        logger.info(`Contact created in Momentum ${JSON.stringify(contactMomentum, null,2 )}`);

        // Update Function

        const updatedContact = await updateContactById(contact.id, contactMomentum);
        logger.info(`Contact updated successfully ${JSON.stringify(updatedContact, null,2 )}`);

        // return; // todo remove after testing
      } catch (error) {
        logger.error(`Error syncing HubSpot to Momentum:`, error);
      }
    }
    logger.info(" All contacts synced successfully.");
  } catch (error) {
    logger.error(`Error syncing HubSpot to Momentum:`, error);
    return;
  }
}

export { syncContactMomentum };
