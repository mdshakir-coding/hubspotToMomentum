import { logger, getAllCompanies, getAllContacts } from "../index.js";
import { buildMomentumCompanyPayload } from "../utils/helper.js";
import { buildMomentumContactPayload } from "../utils/helper.js";

async function syncHubspotToMomentum() {
  try {
    // call the function
    const companies = await getAllCompanies();

    console.log("final Companies:", companies.length);
    //    return;

    // const contacts = await getAllContacts();
    // console.log("final Contacts:", contacts.length);
    //   return;

    for (const comapny of companies) {
      try {
        console.log("Company:", comapny);
        const companyPayload = buildMomentumCompanyPayload(comapny);
        console.log(" Company Payload", companyPayload);

        
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

export { syncHubspotToMomentum };
