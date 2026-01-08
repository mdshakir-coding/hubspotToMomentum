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
    // console.log("final Contacts:", contacts.length);
    // console.log("final Contacts:", contacts[0]);
    // return;

    // call the Token
    const accessToken = await getAccessToken();

    // caal the function
     const contacts = await getContactsModifiedLast1Hour();
     console.log("final Contacts:", contacts.length);
     console.log ("final Contacts:", contacts[0]);
    //  return; //todo remove after testing

    for (const contact of contacts) {
      try {
        // search based Contacts id

        // if (contact?.id !== "101100491877") {
        //   // skip other contacts
        //   continue;
        // }
        // console.log("Processing Contact:", contact);
        // return;

        if (contact.properties?.sync_to_momentum === "No" || contact.properties?.sync_to_momentum === null
          || contact.properties?.sync_to_momentum === undefined ) {
            console.log ("Sync To momentum is no for Contact " , contact);
            continue;
          }

        // console.log("Contact ID:", contact);
        // return;
        // search based on sorceid if exist continue
        const existingContact = await searchContractBySourceId(
          contact?.properties?.sourceid
        );

        if (existingContact) {
          console.log(
            "Contact already exists in Momentum:",
            existingContact.id
          );
          continue;
        }
        
        // search associated company

        const associatedCompany = await getAssociatedCompanyByContactId(
          contact.id
        );
        console.log("Associated Company:", associatedCompany);
        if (!associatedCompany) {
          console.log(
            "No associated company found for contact ID:",
            contact.id
          );
          continue;
        }
        
        let company = null;

        if (associatedCompany.id) {
          company = await getCompanyById(associatedCompany.id);
          console.log("Company:", company);
        }
        console.log("Contact:", contact);
        const contactPayload = buildMomentumContactPayload(contact, company);
        console.log(" Contact Payload", contactPayload);
        
        let contactMomentum = null;
        // // ✅ Create Contact in Momentum
        contactMomentum = await createContactInMomentum(contactPayload,accessToken);
        console.log("➕ Contact created in Momentum:", contactMomentum);

        // Update Function

        const updatedContact = await updateContactById(contact.id, contactMomentum);
        console.log("Contact updated successfully:", updatedContact);

        return; // todo remove
      } catch (error) {
        console.error("Error syncing HubSpot to Momentum:", error);
      }
    }
    console.log(" All contacts synced successfully.");
  } catch (error) {
    console.error("Error syncing HubSpot to Momentum:", error);
    return;
  }
}

export { syncContactMomentum };
