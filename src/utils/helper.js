// for company Payload


// function buildMomentumCompanyPayload(hubspotCompany) {
//   return {
//     commercialName: hubspotCompany.properties?.name || null,
//     Email: hubspotCompany.properties?.email || null,
//     Phone: hubspotCompany.properties?.phone || null,
//     Address1: hubspotCompany.properties?.address || null,
//     City: hubspotCompany.properties?.city || null,
//     State: hubspotCompany.properties?.state || null,
//     Zip: hubspotCompany.properties?.zip || null
//   };
// }

function buildMomentumCompanyPayload(hubspotCompany) {
  const props = hubspotCompany.properties || {};

  return {
    commercialName: props.name || null,
    Email: props.email || null,      // must be custom property in HubSpot
    Phone: props.phone || null,
    Address1: props.address || null,
    City: props.city || null,
    State: props.state || null,
    Zip: props.zip || null
  };
}





// for Contact Payload

function buildMomentumContactPayload(hubspotContact) {
  return {
    FirstName: hubspotContact.properties?.firstname || null,
    LastName: hubspotContact.properties?.lastname || null,
    Email: hubspotContact.properties?.email || null,
    Phone: hubspotContact.properties?.phone || null,
    Address1: hubspotContact.properties?.address || null,
    City: hubspotContact.properties?.city || null,
    State: hubspotContact.properties?.state || null,
    Zip: hubspotContact.properties?.zip || null
  };
}






export{buildMomentumCompanyPayload,buildMomentumContactPayload};

