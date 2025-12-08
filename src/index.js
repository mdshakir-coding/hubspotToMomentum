
import "dotenv/config";

import { app } from "./app.js"; 
import { logger } from "./utils/winstonlogger.js";
import { getHubspotContacts, getHubspotCompanies, createHubspotCompany, createCompanyInMomentum, 
    associateCompanyToContact, searchCompanyBySourceId, getAssociatedCompanies,updateHubspotContact } from "./service/hubspot.js";

import { 
  getAccessToken,
  insertInsuredInMomentum,
  fetchMomentumCustomers,
  getMomentumInsuredContacts,
  // createCompanyInMomentum,
  PutCompanyInMomentum,
  fetchAllCustomerToMomentum
} from "./service/momentum.service.js";

import { hubspotToMomentumsync } from "./Controller/hubspotToMomentum.js";
import{createHubspotContact}from "./service/hubspot.js"
import{searchContactBySourceId}from "./service/hubspot.js"
import{getAllHubspotCompanies}from "./service/hubspot.js"
import{searchContactByEmail}from "./service/hubspot.js"
 //-----------------------------------+------------------------------------------//
export { 
  app,
  logger,
  createHubspotCompany,
  fetchMomentumCustomers,
  getHubspotContacts,
  getHubspotCompanies,
  createCompanyInMomentum,
  hubspotToMomentumsync,
  getAccessToken,
  insertInsuredInMomentum,
  associateCompanyToContact,
  searchCompanyBySourceId,
  getAssociatedCompanies,
  getMomentumInsuredContacts,
  createHubspotContact,
  searchContactBySourceId,
  getAllHubspotCompanies,
  PutCompanyInMomentum,
  searchContactByEmail,
  updateHubspotContact,
  fetchAllCustomerToMomentum

};
