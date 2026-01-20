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
  const data = hubspotContact?.properties || {};
  const data2 = hubspotCompany?.properties || {};

  const payload = {
    // CommercialName:data2?.name || null,
    // FirstName: data?.firstname || null,
    // LastName: data?.lastname || null,
    // Email: data?.email || null,
    // Phone: data?.phone || null,
    // Address1: data?.address || null,
    // City: data?.city || null,
    // State: data?.state || null,
    // Zip: data?.zip || null,

    CommercialName: data?.company || null,
    FirstName: data?.firstname || null,
    LastName: data?.lastname || null,
    AddressLine1: data?.project_address || null,
    AddressLine2: data?.project_address_2  || null,
    State: data?.project_state || data?.mailing_address_state || null,
    City: data?.project_city || data?. mailing_address_city|| null,
    EMail: data?.email || null,
    Phone: data?.phone || null,
    Description: data?.project_description || null,
    Type:data?.audience_type ||null,
    Description:data?.project_description || null,
    Website:data?.tf_url || null,
    PrimaryAgencyOfficeLocationName:data?.project_location || null,
    OverRideUserRequestValue:data?.tell_us_more_about_your_request || null,




    // comapny Mapping fileds
    FirstName:data2.name || null,
    AddressLine1:data2?.address || null,
    City:data2?.city || null,
    State:data2?.state || null,
    ZipCode:data2?.zip || null,
    Phone:data2?.phone || null,
    CustomerId:data2.buildertrend_id || null,
    LeadSources:data2.source_toolbox || null,


  };
  return payload;
}

export { buildMomentumCompanyPayload, buildMomentumContactPayload };
