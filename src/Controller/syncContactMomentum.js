
import { logger,  getAllContacts } from "../index.js";
import { buildMomentumContactPayload } from "../utils/helper.js";
import{getContactsModifiedLast1Hour} from "../service/momentum.service.js";
import { getAccessToken } from "../service/momentum.service.js";
import{createContactInMomentum} from '../service/hubspot.js';

// sync contacts in momentum

async function syncContactMomentum() {
  try {
    // call the function

    // const contacts = await getAllContacts();
    // console.log("final Contacts:", contacts.length);
    //   return;

        // call the Token
    const accessToken = await getAccessToken();


       // caal the function
     const contacts = await getContactsModifiedLast1Hour();
     console.log("final Contacts:", contacts.length);
    //  return; //todo remove after testing

    for (const contact of contacts) {
      try {

        if (contact.properties?.sync_to_momentum === "No" || contact.properties?.sync_to_momentum === null
          || contact.properties?.sync_to_momentum === undefined ) {
            console.log ("Sync To momentum is no for Contact " , contact);
            continue;
          }


        console.log("Contact:", contact);
        const contactPayload = buildMomentumContactPayload(contact);
        console.log(" Contact Payload", contactPayload);

        // ✅ Create Contact in Momentum
        contactMomentum = await createContactInMomentum(contactPayload,accessToken);
        console.log("➕ Contact created in Momentum:", contactMomentum.id);
        let contactMomentum = null;
        

        
        return;

      } catch (error) {
        console.error("Error syncing HubSpot to Momentum:", error);
      }
    }
  } catch (error) {
    console.error("Error syncing HubSpot to Momentum:", error);
    return;
  }


}
export { syncContactMomentum };