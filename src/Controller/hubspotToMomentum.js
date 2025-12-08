// controllers/momentum.controller.js

import {
  getHubspotContacts,
  getHubspotCompanies,
  getAccessToken,
  fetchMomentumCustomers,
  getMomentumInsuredContacts,
  createHubspotCompany,
  createHubspotContact,
  searchCompanyBySourceId,
  searchContactBySourceId,
  associateCompanyToContact,
  insertInsuredInMomentum,
  searchContactByEmail,
  updateHubspotContact,
  
  logger,
} from "../index.js";

async function hubspotToMomentumsync() {
  try {
    const token = await getAccessToken();

    // -------------------------
    // 1️⃣ SYNC Momentum → HubSpot
    // -------------------------
    console.log("\n=== SYNCING MOMENTUM → HUBSPOT ===");

    const momentumCompanies = await fetchMomentumCustomers(token);
    console.log("Momentum companies:", momentumCompanies.length);

    // throw new Error("stop");


    // for (const mc of momentumCompanies) {
    //   try {
    //     console.log(`\nCompany: ${JSON.stringify(mc)}`);
    //     // throw new Error("stop");

    //     // 1. Check if exists
    //     let existingCompany = await searchCompanyBySourceId(
    //       mc.id,
    //       mc.commercialName
    //     );
    //     if (existingCompany) {
    //       console.log("✔ Company already exists in HubSpot");
    //     } else {
    //       // 2. Create company
    //       existingCompany = await createHubspotCompany(mc);
    //       console.log("➕ Company created in HubSpot");
    //     }

    //     const companyId = existingCompany.id; //  Company id

    //     // 3. Fetch contacts for that company
    //     const momentumContacts = await getMomentumInsuredContacts(
    //       token,
    //       mc.databaseId
    //     );

    //     for (const ct of momentumContacts) {
    //       try {
    //         // console.log(`Contact: }`,ct);
    //         // 4. Check if contact exists

    //         let conatctid = null;

    //         const existingContact = await searchContactByEmail(
    //           ct.businessEMail
    //         );
    //         if (existingContact) {
    //           console.log(`✔ Contact exists:`, existingContact);
    //           conatctid = existingContact.id;
    //           // Update contact here
    //           const updatedContact = await updateHubspotContact(ct, conatctid);
    //           console.log("✔ Contact updated:", updatedContact.id);
    //         } else {
    //           // 5. Create HubSpot contact
    //           const newCt = await createHubspotContact(ct);
    //           console.log("➕ Contact created:", newCt.id);
    //           conatctid = newCt.id;
    //         }

    //         // 6. Associate
    //         const associated = await associateCompanyToContact(
    //           companyId,
    //           conatctid
    //         );
    //         console.log("✔ Associate contact to company:", associated);
    //         console.log("✔ CONTACTID", conatctid);
    //         console.log("✔ companyId", companyId);
            

    //         throw new Error("stop associateCompanyToContact "); //
    //       } catch (error) {
    //         logger.error("❌ Error with contact:", error);
    //         break; //todo remove after testing
    //       }
    //     }
    //   } catch (err) {
    //     console.error("❌ Error with company:", err.message);
    //     break; // remember to remove this
    //   }
    // }



for (const mc of momentumCompanies) {
      try {
        console.log(`\nCompany: ${JSON.stringify(mc)}`);
        // throw new Error("stop");

        // 1. Check if exists
        let existingCompany = await searchCompanyBySourceId(
          mc.id,
          mc.commercialName
        );
        if (existingCompany) {
          console.log("✔ Company already exists in HubSpot");
        } else {
          // 2. Create company
          existingCompany = await createHubspotCompany(mc);
          console.log("➕ Company created in HubSpot");
        }

        const companyId = existingCompany.id; //  Company id

        // 3. Fetch contacts for that company
        const momentumContacts = await getMomentumInsuredContacts(
          token,
          mc.id
        );

        // console.log ("momentumContacts", momentumContacts);
        // throw new Error("stop");

        for (const ct of momentumContacts) {
          try {
            // console.log(`Contact: }`,ct);
            // 4. Check if contact exists

            let conatctid = null;

            const existingContact = await searchContactByEmail(
              ct.businessEMail
            );
            if (existingContact) {
              console.log(`✔ Contact exists:`, existingContact);
              conatctid = existingContact.id;
              // Update contact here
              const updatedContact = await updateHubspotContact(ct, conatctid);
              console.log("✔ Contact updated:", updatedContact.id);
            } else {
              // 5. Create HubSpot contact
              const newCt = await createHubspotContact(ct);
              console.log("➕ Contact created:", newCt.id);
              conatctid = newCt.id;
            }

            // 6. Associate
            const associated = await associateCompanyToContact(
              companyId,
              conatctid
            );
            console.log("✔ Associate contact to company:", associated);
            console.log("✔ CONTACTID", conatctid);
            console.log("✔ companyId", companyId);
            

            // throw new Error("stop associateCompanyToContact "); //
          } catch (error) {
            logger.error("❌ Error with contact:", error);
            // break; //todo remove after testing
          }
        }
      } catch (err) {
        console.error("❌ Error with company:", err.message);
        // break; // remember to remove this
      }
    }





    // return; //todo remove after testing

    // -------------------------
    // 2️⃣ SYNC HubSpot → Momentum
    // -------------------------
    console.log("\n=== SYNCING HUBSPOT Contact → MOMENTUM Contact ===");

    const hubspotContacts = await getHubspotContacts();
    console.log("HubSpot contacts:", hubspotContacts.length);
  
    // for (const hc of hubspotContacts) {
    //   try {
    //     const synced = await insertInsuredInMomentum(hc, token);
    //     console.log("✔ Synced to Momentum:", synced);
    //   } catch (err) {
    //     console.error("❌ Contact sync failed:", err.message);
    //   }
    // }

    console.log("\n=== SYNC COMPLETE ===");
  } catch (error) {
    console.error("❌ Fatal sync error:", error.message);
  }
}

export { hubspotToMomentumsync };
