import "dotenv/config";
// import dotenv from "dotenv";
import { app, logger, getHubspotContacts, getHubspotCompanies,createCompanyInMomentum,hubspotToMomentumsync,fetchAllCustomerToMomentum} from "./index.js";
  
import { getAccessToken } from "./service/momentum.service.js";
console.log("Loaded Token:", process.env.HUBSPOT_API_ACCESS_TOKEN); // debug

const PORT = process.env.PORT || 5000;

app.listen(PORT, async function () {
  // getHubspotContacts();
  // getHubspotCompanies();
  hubspotToMomentumsync();
    //  createCompanyInMomentum();
    // hubspotToMomentumsync();
    // const contact = await getHubspotContacts();
    // console.log("final Contacts:", contact.length);
    const token = await getAccessToken();
    //  const allcontacts = await fetchAllCustomerToMomentum(token);
    //  console.log("final Customers from Momentum:", allcontacts.length);
  
    
    
  logger.info(`Listening on port ${PORT}`);
});
