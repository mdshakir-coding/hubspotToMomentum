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

function buildMomentumContactPayload(contact, company = {}) 
 {
  // const data = hubspotContact?.properties || {};
  // const data2 = hubspotCompany?.properties || {};

  const payload = cleanProps({


    insured_type: "Commercial",
      type: 0,

    // FirstName: data?.firstname || null,
    // LastName: data?.lastname || null,
    commercialName: company?.properties?.name || null,
    Email: contact?.properties?.email || null,
    Phone: contact?.properties?.phone || null,
    AddressLine1: contact?.properties?.address || null,
    city: contact?.properties?.city || null,
    State: contact?.properties?.state || null,
    Zip: contact?.properties?.zip || null,

   // new 
    //   insured_type: "Commercial",
    // type: 0,

    // commercialName: data2?.properties?.name || null,
    // addressLine1: data?.properties?.address || null,
    // city: data?.properties?.city || null,
    // zipCode: data?.properties?.project_zip_code || null,
    // eMail: data?.properties?.email || null,
    // phone: data?.properties?.phone || null,
    // cellPhone: data?.properties?.phone_number_1 || null,
    // smsPhone: data?.properties?.second_phone || null,
    // description: data?.properties?.project_description || null,
    // website: data?.properties?.website || null,
    // fax: data?.properties?.fax || null,
  });

  return payload;
}


function buildProspectsPayload(contact, company) {
  const payload = cleanProps({
    // toInsert: {
    //   type: "Prospect",
    //  commercialName: "Metzger Insurance Agency",
    insured_type: "Commercial",
    type: 0,
    // active: true,
    // type: "Prospect",
    // type: "true",

    // firstName: contact?.properties?.firstname || null,
    // lastName: contact?.properties?.lastname || null,
    commercialName: company?.properties?.name || null,
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

    // }
  });

  return payload;
}

// insert principal payload
function buildPrincipalPayload(contact, insuredDatabaseId) {
  const payload = cleanProps({

    

    insured_database_id: insuredDatabaseId,
    first_name: contact?.properties?.firstname || null,
    last_name: contact?.properties?.lastname || null,
      personal_email: contact?.properties?.email || null,
      business_email: contact?.properties?.email || null,
      insured_email: contact?.properties?.email || null,

    // match_record_base_on_name: true,
    // is_primary: true,



  });

  return payload;
}

function buildQuotePayload(contact, deal, databaseId) {
  const payload = cleanProps({

     insured_type: "Commercial",
    type: 0,

    // number: contact?.properties?.number || null,
    number: "QT-100245",

    insured_database_id:databaseId || null,
    // first_name: contact?.properties?.firstname || null,
    // last_name: contact?.properties?.lastname || null,
    dealname: deal?.properties?.dealname || null,
    email: contact?.properties?.email || null,
    description: deal?.properties?.description || null,
    billing_type: deal?.properties?.dealtype || null,



    });

  return payload;
}


export {
  buildMomentumCompanyPayload,
  buildMomentumContactPayload,
  cleanProps,
  buildProspectsPayload,
  buildPrincipalPayload,
  buildQuotePayload,
};
