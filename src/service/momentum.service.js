// import axios from "axios";

import axios from "axios";
import qs from "qs";
import { logger } from "../index.js";

// get access token
async function getAccessToken() {
  try {
    const body = qs.stringify({
      grant_type: "password",
      client_id: "ngAuthApp",
      username: "manik.soi@insidea.com",
      password: "Insidea123",
    });

    const response = await axios.post(
      "https://api.nowcerts.com/api/token",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // console.log("Token:", response.data.access_token);
    return response.data.access_token;
  } catch (err) {
    console.error("Token error:", err.response?.data || err.message);
    return null;
  }
}

// insert insured to momentum

async function insertInsuredInMomentum(contact, token) {
  try {
    const contactData = contact.properties;
    const payload = {
      FirstName: contactData.firstname,
      LastName: contactData.lastname,
      Email: contactData.email,
      Phone: contactData.phone,
      Address1: contactData.address,
      City: contactData.city,
      State: contactData.state,
      Zip: contactData.zip,
    };

    console.log("contact:", contact);

    console.log("payload", payload);
    const response = await axios.post(
      "https://api.nowcerts.com/api/Insured/Insert",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Momentum Error:", error.response?.data || error);
    return null;
  }
}

async function createOpportunityInMomentum(opportunityData, token) {
  try {
    const response = await axios.post(
      "https://api.momentum.io/opportunities", // <-- Replace with real URL
      opportunityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Opportunity in Momentum:",
      error.response?.data || error.message
    );
    return null;
  }
}

// fetch customers
// async function fetchMomentumCustomers(token, name = "Turner Homes LLC") {
//   try {
//     const url = `https://api.nowcerts.com/api/Customers/GetCustomers?Name=${encodeURIComponent(
//       name
//     )}`;

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },

//       // If you need cookies:
//       // withCredentials: true
//     });

//     // console.log("NowCerts Customers Fetched:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error fetching customers from NowCerts:",
//       error.response?.data || error.message
//     );
//     return [];
//   }
// }

// fetch customers based on date

async function fetchMomentumCustomers(token) {
  try {
    console.log("Fetching Customers from NowCerts");

    const url = 
      "https://api.nowcerts.com/api/InsuredDetailList" +
      "?$count=true" +
      "&$orderby=ChangeDate desc" +
      "&$skip=0" +
      "&$filter=ChangeDate ge 2025-12-03T12:00:00Z";  // EXACT same as curl

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("NowCerts Customers Fetched:", response.data.value.length);

    return response.data.value;

  } catch (error) {
    console.error(
      "Error fetching customers from NowCerts:",
      error.response?.data || error.message
    );
    return [];
  }
}







//Get insured contacts

async function getMomentumInsuredContacts(token, insuredIds) {
  const url = "https://api.nowcerts.com/api/Insured/InsuredContacts";

  const body = {
    insuredDataBaseId: [insuredIds],
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "Error fetching insured contacts:",
      error.response?.data || error
    );
    return null;
  }
}

// put company in momentum

async function PutCompanyInMomentum(token, companyData) {
  const url = "https://api.nowcerts.com/api/Company/Insert";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
      // Add cookie header only if required by your environment
      // 'Cookie': 'ARRAffinity=your_affinity_cookie; ARRAffinitySameSite=your_affinity_cookie'
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error creating company: ${response.status} ${JSON.stringify(errorData)}`
    );
  }

  return response.json();
  s;
}

// fetch All momentum customers

// const MOMENTUM_BASE_URL = process.env.MOMENTUM_BASE_URL;

// Helper to generate A-Z
//todo remove
// const getAlphabets = () =>
//   Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
// const numericChars = () =>
//   Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i));

/**
 * Fetch customers from Momentum for names starting with each alphabet A-Z
 * Supports pagination per letter
 */
// async function fetchAllCustomerToMomentum(token) {

//   try {
//     let allCustomers = [];
//     const alphabets = getAlphabets();
//     alphabets.push(...numericChars()); // Add numeric characters 0-9

//     for (const letter of alphabets) {
//       logger.info(`🔎 Fetching customers starting with: ${letter}`);

//       let page = 1;
//       let pageSize = 200;

//       let hasMore = true;

//       while (hasMore) {

//         // const url = `/api/Customers/GetCustomers?Name=${encodeURIComponent(
//     // )}`;
//         const url = `https://api.nowcerts.com/api/Customers/GetCustomers`;

//         const response = await axios.get(url, {
//           params: {
//             Name: letter,     // Filter by starting alphabet
//             Page: page,
//             PageSize: pageSize,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = response.data;

//         // some APIs return data.items, some return data
//         const customers = data.items || data || [];

//         // if (customers.length > 0) {
//         //   logger.info(`  Page ${page}: fetched ${customers.length} customers`);
//         // }

//         allCustomers.push(...customers);

//         console.log('allCustomers.length:',allCustomers.length);

//         hasMore = customers.length === pageSize;
//         page++;
//       }
//     }

//     logger.info(`✅ Total customers fetched from A–Z: ${allCustomers.length}`);

//     return allCustomers;

//   } catch (error) {
//     logger.error("❌ Error fetching customers:", error.message);
//     return [];
//   }
// }

/**
 * Fetch ALL customers from Momentum using DatabaseId
 * Uses pure pagination (no A-Z filtering)
 */

// all databae logic

async function fetchAllCustomerToMomentum(token, maxId = 5000) {
  let all = [];

  for (let id = 1; id <= maxId; id++) {
    const url = `https://api.nowcerts.com/api/Customers/GetCustomers?CustomerId=${id}`;
    console.log("Fetching ID:", id);

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        all.push(...res.data);
      }
    } catch (e) {
      console.log("Error on id:", id, e.message);
    }
  }

  const unique = Object.values(
    all.reduce((acc, c) => {
      acc[c.CustomerId] = c;
      return acc;
    }, {})
  );

  console.log("TOTAL UNIQUE CUSTOMERS:", unique.length);
  return unique;
}

// Insert NowCerts Comapny 


 async function insertNowCertsCompany(payload) {
  try {
    const response = await axios.post(
      "https://api.nowcerts.com/api/Insured/Insert",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error inserting insured:",
      error.response?.data || error.message
    );
    throw error;
  }
}


// Insert Nowcerts Contacts

async function insertNowCertsContacts(payload) {
  try {
    const response = await axios.post(
      "https://api.nowcerts.com/api/Insured/Insert",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "NowCerts Insured Insert Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// search company in momentum from delta

 async function getCompaniesModifiedLast1Hour() {
  try {
    // ⏱️ Calculate 1 hour ago (ISO format)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    let companies = [];
    let after;

    do {
      const response = await axios.post(
        "https://api.hubapi.com/crm/v3/objects/companies/search",
        {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "hs_lastmodifieddate",
                  operator: "GTE",
                  value: oneHourAgo,
                },
                {
                  propertyName: "sync_to_momentum",
                  operator: "EQ",
                  value: "yes"
                }
              ],
            },
          ],
          properties: [
            "name",
            "domain",
            "phone",
            "sync_to_momentum",
            "hs_lastmodifieddate",
          ],
          limit: 100,
          after,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      companies.push(...response.data.results);
      return companies; // todo after remove testing
      
      after = response.data.paging?.next?.after;

    } while (after);

    return companies;

  } catch (error) {
    console.error(
      "❌ Error fetching HubSpot companies (last 1 hour):",
      error.response?.data || error.message
    );
    return [];
  }
}

// search contacts in momentum from delta
 async function getContactsModifiedLast1Hour() {
  try {
    // ⏱️ 1 hour ago (UTC, ISO)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    let contacts = [];
    let after;

    do {
      const response = await axios.post(
        "https://api.hubapi.com/crm/v3/objects/contacts/search",
        {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "sync_to_momentum",
                  operator: "EQ",
                  value: "no",
                },
                // {
                //   propertyName: "lastmodifieddate",
                //   operator: "GTE",
                //   value: oneHourAgo,
                // },
              ],
            },
          ],
          properties: [
            "firstname",
            "lastname",
            "email",
            "phone",
            "sync_to_momentum",
            "lastmodifieddate",
            "souceid",
          ],
          limit: 100,
          after,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      contacts.push(...response.data.results);
      return contacts; //todo remove after Testing
      after = response.data.paging?.next?.after;

    } while (after);

    return contacts;

  } catch (error) {
    console.error(
      "❌ Error fetching HubSpot contacts (last 1 hour):",
      error.response?.data || error.message
    );
    return [];
  }
}

// search contact 

async function searchContractBySourceId(sourceId) {
  if (!sourceId) return {};

  try {
    const url = "https://api.hubapi.com/crm/v3/objects/contracts/search";

    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "sourceid",
              operator: "EQ",
              value: sourceId,
            },
          ],
        },
      ],
      properties: [
        "sourceid",
        
      ],
      limit: 10,
      after: 0,
    };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_API_ACCESS_TOKEN}`,
      },
    });

    return response.data.results[0];
  } catch (error) {
    console.error(
      "Error searching deal by sourceid:",
      error.response?.data || error.message
    );
    return {};
  }
}





export {
  getAccessToken,
  insertInsuredInMomentum,
  createOpportunityInMomentum,
  fetchMomentumCustomers,
  getMomentumInsuredContacts,
  PutCompanyInMomentum,
  fetchAllCustomerToMomentum,
  insertNowCertsCompany,
  insertNowCertsContacts,
  getCompaniesModifiedLast1Hour,
  getContactsModifiedLast1Hour,
  searchContractBySourceId,
};
