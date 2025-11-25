import "dotenv/config";
// import dotenv from "dotenv";
import { app, logger, getHubspotContacts, getHubspotCompanies,createCompanyInMomentum,hubspotToMomentumsync,} from "./index.js";
  

console.log("Loaded Token:", process.env.HUBSPOT_API_ACCESS_TOKEN); // debug

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  // getHubspotContacts();
  // getHubspotCompanies();
  // hubspotToMomentumsync();
    //  createCompanyInMomentum();
    hubspotToMomentumsync();
    
    
  logger.info(`Listening on port ${PORT}`);
});
