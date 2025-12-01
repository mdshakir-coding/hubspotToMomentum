import "dotenv/config";
// import dotenv from "dotenv";
import { app, logger, getHubspotContacts, getHubspotCompanies,createCompanyInMomentum,hubspotToMomentumsync} from "./index.js";
  

console.log("Loaded Token:", process.env.HUBSPOT_API_ACCESS_TOKEN); // debug

const PORT = process.env.PORT || 5000;

app.listen(PORT, async function () {
  // getHubspotContacts();
  // getHubspotCompanies();
  // hubspotToMomentumsync();
    //  createCompanyInMomentum();
    // hubspotToMomentumsync();
    const contact = await getHubspotContacts();
    console.log("final Contacts:", contact.length);
  
    
    
  logger.info(`Listening on port ${PORT}`);
});
