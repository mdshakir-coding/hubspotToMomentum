import "dotenv/config";
import axios from "axios";
import { logger } from "../index.js";

// Use ONE TOKEN everywhere

// Common axios instance
const hubspot = axios.create({
  baseURL: "https://api.hubapi.com/crm/v3/objects/",
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,

    "Content-Type": "application/json",
  },
});

// ---------------------
// GET CONTACTS
// ---------------------
async function getHubspotContacts(limit = 100) {
  let contacts = [];
  let after = undefined;

  try {
    while (true) {
      const params = {
        limit,
        properties: ["firstname", "lastname", "email","address","phone","city","state","zip"],
        ...(after && { after }),
      };

      const response = await hubspot.get("contacts", { params });
      const data = response.data;

      contacts.push(...data.results);

      logger.info(`Fetched ${data.results.length} contacts`);

      return contacts;

      if (data.paging?.next?.after) {
        after = data.paging.next.after;
      } else {
        break;
      }
    }

    logger.info(`Fetched ${contacts.length} HubSpot contacts`);

    return contacts;
  } catch (error) {
    logger.error(
      "Error fetching HubSpot contacts:",
      error.response?.data || error.message
    );
    return [];
  }
}

// ---------------------
  //  GET COMPANIES
// ---------------------
async function getHubspotCompanies(limit = 100) {
  let companies = [];
  let after = undefined;

  try {
    while (true) {
      const params = {
        limit,
        properties: [
          "name",
          "domain",
          "industry",
          "city",
          "country",
          "website",
          "phone",
        ],
        ...(after && { after }),
      };
   

      const response = await hubspot.get("companies", { params });
      const data = response.data;

      companies.push(...data.results);
      logger.info(`Fetched ${data.results.length} companies`);    

      if (data.paging?.next?.after) {
        after = data.paging.next.after;
      } else {
        break;
      }
    }

    return companies;
  } catch (error) {
    logger.error(
      "Error fetching HubSpot companies:",
      error.response?.data || error.message
    );
    return [];
  }

}

 // services/momentumContact.service.js


// async function createMomentumCompany(company) {
//   try {
//     const response = await axios.post(
//       "https://api.momentum.io/v1/companies",
//       {
//         name: company.name,
//         email: company.email,
//         phone: company.phone,
//         address1: company.address1,
//         address2: company.address2,
//         city: company.city,
//         state: company.state,
//         zip: company.zip,
//         website: company.website,
//         industry: company.industry
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.MOMENTUM_ACCESS_TOKEN}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return response.data;

//   } catch (error) {
//     console.error(
//       "Error creating Momentum company:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// }

// create in company in momentum

async function createCompanyInMomentum(companyData, accessToken) {
  try {
    const response = await axios.post(
      "https://api.nowcerts.com/api/Insured/Insert",
      companyData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Company created successfully in Momentum");
    return response.data;

  } catch (error) {
    console.error(
      "Error creating company in Momentum:",
      error.response?.data || error.message
    );
    throw error;
  }
}






// create company in hubspot  


async function createHubspotCompany(company, token) {
  try {
    const url = "https://api.hubapi.com/crm/v3/objects/companies";

    const payload = {
      properties: {
        name: company.commercialName,       // FIXED
        phone: company.phone || company.cellPhone || company.smsPhone || null,
        address: company.addressLine1,
        city: company.city,
        state: company.stateNameOrAbbreviation,
        zip: company.zipCode,
        sourceid: company.databaseId        // FIXED
      }
    };

    // console.log("Payload to HubSpot:", payload);

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    // console.log("Company created in HubSpot:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "Error creating company in HubSpot:",
      error.response?.data || error.message
    );
    return null;
  }
}



 async function searchCompanyBySourceId(sourceId) {
  try {
    const url = "https://api.hubapi.com/crm/v3/objects/companies/search";

    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "sourceid",
              operator: "EQ",
              value: sourceId
            }
          ]
        }
      ],
      properties: ["name", "sourceid", "domain", "createdate"],
      limit: 1
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log("HubSpot company search result:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "Error searching company by sourceId:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// getAssociatedCompanies

 async function getAssociatedCompanies(contactIds) {
  const url = "https://api.hubapi.com/crm/v4/associations/contacts/companies/batch/read";

  const payload = {
    inputs: contactIds.map(id => ({ id }))
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    return response.data; // return association results
  } catch (error) {
    console.error("Error fetching associated companies:", error.response?.data || error.message);
    throw error;
  }
}

// contact to company in hubspot

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_API_ACCESS_TOKEN,
// });

// // Associate Contact ↔ Company
// async function associateContactToCompany(contactId, companyId) {
//   try {
//     const response = await hubspotClient.crm.companies.associationsApi.create(
//       companyId,
//       "contacts",
//       contactId,
//       "company_to_contact"         // association type
//     );

//     console.log("Association created:", response);
//     return response;

//   } catch (err) {
//     console.error("Error associating contact with company:", err.response?.body || err.message);
//     throw err;
//   }
// }
 

   // create contact to hubspot
async function createHubspotContact(contactData) {
  try {
    const payload = {
      properties: {
        firstname: contactData.firstname,
        lastname: contactData.lastname,
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address,
        city: contactData.city,
        state: contactData.state,
        zip: contactData.zip,
      }
    };

    // console.log("Creating HubSpot Contact:", payload);
    // console.log("TOKEN CHECK:", process.env.HUBSPOT_API_ACCESS_TOKEN); // debug

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("❌ HubSpot Create Contact Error:", error.response?.data || error);
    return null;
  }
}


// search contact to hubspot

async function associateCompanyToContact(companyId, contactId) {
  const url = "https://api.hubapi.com/crm/v3/associations/contacts/companies/batch/create";

  const payload = {
    inputs: [
      {
        from: { id: contactId },
        to: { id: companyId },
        type: "contact_to_company"
      }
    ]
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
}


// search contact by sourceid
async function searchContactBySourceId(sourceId) {
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "sourceId",   // your custom property name
                operator: "EQ",
                value: sourceId
              }
            ]
          }
        ],
        properties: ["firstname", "lastname", "email", "phone", "sourceId"],
        limit: 1
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.total === 0) {
      console.log("No contact found for sourceId:", sourceId);
      return null;
    }

    console.log("Found Contact:", response.data.results[0]);
    return response.data.results[0];

  } catch (error) {
    console.error("❌ Error searching HubSpot contact:", error.response?.data || error);
    return null;
  }
}

// Get All Hubspot company 
   async function getAllHubspotCompanies() {
  try {
    let allCompanies = [];
    let after = undefined;

    while (true) {
      const url = after
        ? `https://api.hubapi.com/crm/v3/objects/companies?limit=100&after=${after}`
        : `https://api.hubapi.com/crm/v3/objects/companies?limit=100`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
        },
      });

      allCompanies = allCompanies.concat(response.data.results);
      
      return allCompanies;
      
      
      // pagination check
      if (!response.data.paging || !response.data.paging.next) break;

      after = response.data.paging.next.after;
    }

    return allCompanies;

  } catch (err) {
    console.error("❌ HubSpot Get All Companies Error:", err.response?.data || err);
    return [];
  }
}


export { getHubspotContacts, getHubspotCompanies,createCompanyInMomentum,createHubspotCompany,associateCompanyToContact
, getAssociatedCompanies,searchCompanyBySourceId,createHubspotContact,searchContactBySourceId,getAllHubspotCompanies};
