function buildMomentumCompanyPayload(hubspotCompany) {
  const data = hubspotCompany.properties || {};

  return {
    commercialName: data.name || null,
    Email: data.email || null, // must be custom property in HubSpot
    Phone: data.phone || null,
    Address1: data.address || null,
    City: data.city || null,
    State: data.state || null,
    Zip: data.zip || null,
  };
}

// for Contact Payload

function buildMomentumContactPayload(hubspotContact, hubspotCompany) {
  const data = hubspotContact.properties || {};
  const data2 = hubspotCompany.properties || {};

  const payload = {
    CommercialName:data2?.name || null,
    FirstName: data?.firstname || null,
    LastName: data?.lastname || null,
    Email: data?.email || null,
    Phone: data?.phone || null,
    Address1: data?.address || null,
    City: data?.city || null,
    State: data?.state || null,
    Zip: data?.zip || null,
  }
  return payload;

};




export { buildMomentumCompanyPayload, buildMomentumContactPayload };
