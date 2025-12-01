
// import axios from "axios";

import axios from "axios";  
import qs from "qs";

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
        }
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
      FirstName:contactData.firstname,
      LastName : contactData.lastname,
      Email: contactData.email,
      Phone: contactData.phone,
      Address1: contactData.address,
      City: contactData.city,
      State: contactData.state,
      Zip: contactData.zip
    }

    console.log('contact:',contact);
    
    console.log('payload',payload); 
    const response = await axios.post(
      "https://api.nowcerts.com/api/Insured/Insert",
      payload,
      {
        headers: {
          Authorization:`Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Momentum Error:", error.response?.data || error);
    return null
  }
}

async function createOpportunityInMomentum(opportunityData, token) {
  try {
    const response = await axios.post(
      "https://api.momentum.io/opportunities",   // <-- Replace with real URL
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
    return null
  }
}

async function fetchMomentumCustomers(token, name = "Turner Homes LLC") {
  try {
    const url = `https://api.nowcerts.com/api/Customers/GetCustomers?Name=${encodeURIComponent(
      name
    )}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
        
      // If you need cookies:
      // withCredentials: true 
    });

    // console.log("NowCerts Customers Fetched:", response.data);
    return response.data;
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
    insuredDataBaseId:[ insuredIds]
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching insured contacts:", error.response?.data || error);
    return null
  }
}





  // put company in momentum

async function PutCompanyInMomentum(token, companyData) {
  const url = 'https://api.nowcerts.com/api/Company/Insert';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HUBSPOT_API_ACCESS_TOKEN}`,
      // Add cookie header only if required by your environment
      // 'Cookie': 'ARRAffinity=your_affinity_cookie; ARRAffinitySameSite=your_affinity_cookie'
    },
    body: JSON.stringify(companyData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error creating company: ${response.status} ${JSON.stringify(errorData)}`);
  }

  return response.json();s
}


export { getAccessToken, insertInsuredInMomentum, createOpportunityInMomentum, fetchMomentumCustomers
  ,getMomentumInsuredContacts,PutCompanyInMomentum};
  