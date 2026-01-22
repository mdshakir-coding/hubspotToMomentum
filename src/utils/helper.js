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

function buildMomentumContactPayload(hubspotContact, hubspotCompany) {
  const data = hubspotContact?.properties || {};
  const data2 = hubspotCompany?.properties || {};

  const payload = cleanProps({
    // Type: audienceTypeMap[data?.audience_type] || null,

    State: normalizeProjectState[data?.project_state] || null,
    CommercialName: data?.company || null,
    FirstName: data?.firstname || null,
    LastName: data?.lastname || null,

    AddressLine1: data?.project_address || null,
    AddressLine2: data?.project_address_2 || null,

    City: data?.project_city || data?.mailing_address_city || null,

    EMail: data?.email || null,
    Phone: data?.phone || null,

    Description: data?.project_description || null,
    Website: data?.tf_url || null,

    // ---- Company fallback fields ----
    FirstName: data2?.name || null,
    AddressLine1: data2?.address || null,
    City: data2?.city || null,
    State: data2?.state || null,
    ZipCode: data2?.zip || null,
    Phone: data2?.phone || null,

    CustomerId: data2?.buildertrend_id || null,
    LeadSources: data2?.source_toolbox || null,
    EMail2: data2?.email || null,
  });

  return payload;
}

function buildProspectsPayload(contact) {
  const payload = cleanProps({
    firstname: contact.properties?.firstname,
    lastname: contact.properties?.lastname,
    email: contact.properties?.email,
    phone: contact.properties?.phone,
    address: contact.properties?.address,
    city: contact.properties?.city,
    state: contact.properties?.state,
    zip: contact.properties?.zip,
    insured_type: "Commercial",
  });

  return payload;
}

export {
  buildMomentumCompanyPayload,
  buildMomentumContactPayload,
  cleanProps,
  buildProspectsPayload,
};
