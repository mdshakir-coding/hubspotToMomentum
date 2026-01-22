function cleanProps(obj) {
  const cleaned = {};

  for (const key in obj) {
    const value = obj[key];

    // Skip undefined
    if (value === undefined) continue;

    // Allow null (HubSpot accepts null for some fields)
    if (value === null) {
      cleaned[key] = null;
      continue;
    }

    // Allow strings and numbers directly
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      cleaned[key] = value;
      continue;
    }

    // If it's an object and has `.toString()`
    if (typeof value === "object") {
      // Capsule rich text: { content: "xxx" }
      if (value.content && typeof value.content === "string") {
        cleaned[key] = value.content;
        continue;
      }

      // Date object → convert to timestamp
      if (value instanceof Date) {
        cleaned[key] = value.getTime();
        continue;
      }

      // Otherwise fallback → JSON string
      cleaned[key] = JSON.stringify(value);
      continue;
    }

    // Everything else → convert to string
    cleaned[key] = String(value);
  }

  return cleaned;
}

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

const audienceTypeMap = {
  "Current Policyholder": "CURRENT_POLICYHOLDER",
  "Looking for a Quote": "LOOKING_FOR_A_QUOTE",
  "Builder/Lender/Developer": "BUILDER_LENDER_DEVELOPER",
  Homeowner: "HOMEOWNER",
  "Information Only": "INFORMATION_ONLY",
};

const projectStateMap = {
  alabama: "ALABAMA",
  alaska: "ALASKA",
  arizona: "ARIZONA",
  arkansas: "ARKANSAS",
  california: "CALIFORNIA",
  colorado: "COLORADO",
  connecticut: "CONNECTICUT",
  delaware: "DELAWARE",
  florida: "FLORIDA",
  georgia: "GEORGIA",
  hawaii: "HAWAII",
  idaho: "IDAHO",
  illinois: "ILLINOIS",
  indiana: "INDIANA",
  iowa: "IOWA",
  kansas: "KANSAS",
  kentucky: "KENTUCKY",
  louisiana: "LOUISIANA",
  maine: "MAINE",
  maryland: "MARYLAND",
  massachusetts: "MASSACHUSETTS",
  michigan: "MICHIGAN",
  minnesota: "MINNESOTA",
  mississippi: "MISSISSIPPI",
  missouri: "MISSOURI",
  montana: "MONTANA",
  nebraska: "NEBRASKA",
  nevada: "NEVADA",
  newhampshire: "NEW_HAMPSHIRE",
  newjersey: "NEW_JERSEY",
  newmexico: "NEW_MEXICO",
  newyork: "NEW_YORK",
  northcarolina: "NORTH_CAROLINA",
  northdakota: "NORTH_DAKOTA",
  ohio: "OHIO",
  oklahoma: "OKLAHOMA",
  oregon: "OREGON",
  pennsylvania: "PENNSYLVANIA",
  rhodeisland: "RHODE_ISLAND",
  southcarolina: "SOUTH_CAROLINA",
  southdakota: "SOUTH_DAKOTA",
  tennessee: "TENNESSEE",
  texas: "TEXAS",
  utah: "UTAH",
  vermont: "VERMONT",
  virginia: "VIRGINIA",
  washington: "WASHINGTON",
  westvirginia: "WEST_VIRGINIA",
  wisconsin: "WISCONSIN",
  wyoming: "WYOMING",
};

function normalizeProjectState(state) {
  if (!state || typeof state !== "string") return null;
  // Lowercase and remove spaces
  const cleaned = state.toLowerCase().replace(/\s+/g, "");
  return projectStateMap[cleaned] || null;
}

// for Contact Payload

function buildMomentumContactPayload(hubspotContact, hubspotCompany = {}) {
  const data = hubspotContact?.properties || {};
  const data2 = hubspotCompany?.properties || {};

  const payload = cleanProps({

    insured_type: "Commercial",
    FirstName: data?.firstname || null,
    LastName: data?.lastname || null,
    Email: data?.email || null,
    Phone: data?.phone || null,
    AddressLine1: data?.address || null,
    city: data?.city || null,
    State: data?.state || null,
    Zip: data?.zip || null,

    
    
    
    
    // CommercialName: data?.company || null,
    // FirstName: data?.firstname || null,
    // LastName: data?.lastname || null,
    // EMail: data?.email || null,
    // Phone: data?.phone || null,
    // AddressLine1: data?.project_address || null,
    // AddressLine2: data?.project_address_2 || null,
    // City: data?.project_city || data?.mailing_address_city || null,
    // State: normalizeProjectState[data?.project_state] || null,
    // Description: data?.project_description || null,
    // Website: data?.tf_url || null,

    // // ---- Company fallback fields ----
    // FirstName: data2?.name || null,
    // AddressLine1: data2?.address || null,
    // City: data2?.city || null,
    // State: data2?.state || null,
    // ZipCode: data2?.zip || null,
    // Phone: data2?.phone || null,

    // CustomerId: data2?.buildertrend_id || null,
    // LeadSources: data2?.source_toolbox || null,
    // EMail2: data2?.email || null,
  });

  return payload;
}
// Exaple payload of prospect
//  "databaseId": "66d26eb0-ca30-499a-8466-9f1b364d97b0",
//         "commercialName": "Test",
//         "firstName": null,
//         "lastName": null,
//         "type": 0,
//         "addressLine1": "Test",
//         "addressLine2": "Test",
//         "stateNameOrAbbreviation": "Alaska",
//         "city": "Test",
//         "zipCode": "Test",
//         "eMail": "test@gmail.com",
//         "eMail2": "test@gmail.com",
//         "eMail3": "test@gmail.com",
//         "fax": "113333333",
//         "phone": "277              22",
//         "cellPhone": "22  22  22",
//         "smsPhone": "11 11 11",
//         "description": "Test",
//         "active": true,
//         "website": "test@gmail.com",
//         "fein": "Test",
//         "customerId": "Test",
//         "insuredId": "123456"

function buildProspectsPayload(contact,company) {
  const payload = cleanProps({
  //  commercialName: company?.properties?.name || null,
    insured_type: "Commercial",
    type: "0",
    type: "true",

    firstName: contact?.properties?.firstname || null,
    lastName: contact?.properties?.lastname || null,
    addressLine1: contact?.properties?.address || null,
    city: contact?.properties?.city || null,
    zipCode: contact?.properties?.project_zip_code || null,
    eMail: contact?.properties?.email || null,
    phone: contact?.properties?.phone || null,
    cellPhone: contact?.properties?.phone_number_1 || null,
    smsPhone: contact?.properties?.second_phone || null,
    description: contact?.properties?.project_description || null,
    website: contact?.properties?.website || null,
    fax: contact?.properties?.fax || null,
    // addressLine2: contact?.properties?.addressLine2 || null,
    // stateNameOrAbbreviation: contact?.properties?.stateNameOrAbbreviation || null,
    // fein: contact?.properties?.fein || null,
    // eMail2: contact?.properties?.eMail2 || null,
    // eMail3: contact?.properties?.eMail3 || null,
    // customerId: contact?.properties?.customerId || null,
    // insuredId: contact?.properties?.insuredId || null




  });

  return payload;
}

export {
  buildMomentumCompanyPayload,
  buildMomentumContactPayload,
  cleanProps,
  buildProspectsPayload,
};
