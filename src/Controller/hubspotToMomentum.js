// controllers/momentum.controller.js
  import{insertInsuredInMomentum} from "../service/momentum.service.js"
  import { app,logger,searchCompanyBySourceId,createHubspotCompany,getHubspotContacts,getHubspotCompanies, createCompanyInMomentum , 
  getAccessToken,fetchMomentumCustomers,getMomentumInsuredContacts,createHubspotContact, searchContactBySourceId,associateCompanyToContact,getAllHubspotCompanies} from "../index.js"
  async function hubspotToMomentumsync() {
  try {
    // Fetch contacts from HubSpot
    const hubspotContacts = await getHubspotContacts();
    // console.log("HubSpot contacts fetched successfully:", hubspotContacts.length);
    // console.log("........fetching")
    const token = await getAccessToken();
    console.log ("token fetched successfully:", token);

    //create company in hubspot

  const companies = await fetchMomentumCustomers(token);
  console.log("Companies fetched from Momentum:", companies.length);

  for (const comp of companies) {
  // console.log("comp", comp);

  try {
    console.log(`\nProcessing Company: ${comp.commercialName} | SourceID: ${comp.databaseId}`);

    // 1. Check if company already exists in HubSpot
    const existing = await searchCompanyBySourceId(comp.databaseId);

    // if (existing.results.length > 0) {
    //   console.log(`✔ Already exists: ${existing.results[0].properties.name}`);
    //   continue;
    // }

    // 2. Create the company
    const newCompany = await createHubspotCompany(comp, token);

        // get contact from momentum
    const contacts = await getMomentumInsuredContacts(token, comp.databaseId);
    console.log("Contacts fetched from Momentum:", contacts);

    
    console.log("➕ Created new HubSpot Company:", newCompany.properties.name);

    // seach contact by sourceId,deduplication logic
     const existingContact = await searchContactBySourceId(comp.databaseId);
     if (existingContact) {
       console.log(`✔ Already exists: ${existingContact.properties.firstname} ${existingContact.properties.lastname}`);
       continue;
     }  


    // create contact in hubspot 
    const newContact = await createHubspotContact(contacts);
    console.log("Contact created successfully in HubSpot:", newContact);
    
    // associate contact to company
    const associateResponse = await associateCompanyToContact(newCompany.id, newContact.id);
    console.log("Association created successfully:", associateResponse);


    throw new Error('Testing ');

  } catch (err) {
    console.error(`❌ Error syncing company: `, err.message);
    // continue; // continue loop instead of stopping
  }
}
    
     

    // Loop through contacts
    for (const contact of hubspotContacts) {
      try {
        // console.log("Syncing contact:", contact);
        
        // Sync contact to Momentum as contact
        // const momentumContact = await insertInsuredInMomentum(contact, token);
        // console.log("Contact synced successfully to Momentum:", momentumContact);
        

      } catch (error) {
        console.error(
          "Error syncing contact to Momentum:",
          error.message
        );
        return;
        // continue; // move to next contact instead of stopping
      }
    }

    // If you want to enable token logic later:
    // const accessToken = await getAccessToken();
      
    // Sync all HubSpot companies
    
    console.log("Fetching all HubSpot companies...");

    const allCompanies = await getAllHubspotCompanies();

    console.log("Total companies found:", allCompanies.length);

    for (const comp of allCompanies) {
      console.log("Company:", comp.properties.name);
    }

  } catch (error) {
    console.error("Error fetching HubSpot contacts:", error.message);
    
  }
}

 // Sync all HubSpot companies

//  {
//   try {
//     console.log("Fetching all HubSpot companies...");

//     const allCompanies = await getAllHubspotCompanies();

//     console.log("Total companies found:", allCompanies.length);

    
//     for (const comp of allCompanies) {
//       console.log("Company:", comp.properties.name);
//     }

//   } catch (err) {
//     console.error("❌ Error in syncing:", err.message);
//   }
// }



export { hubspotToMomentumsync,};
