// this file handles the api calls to the flask backend so pages dont need there own fetch code

import axios from 'axios';

// this is the flask servers address
// changed to live elestic beanstalk server address for frontenddeployment
const API_BASE = 'http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/api';

// used on the passcode entry page to check if the passcode is right
export const verifyPasscode = (passcode) =>
  axios.post(`${API_BASE}/auth/verify`, { passcode });

// used on the change passcode page to set a new passcode
export const changePasscode = (currentPasscode, newPasscode) =>
  axios.post(`${API_BASE}/auth/change`, { currentPasscode, newPasscode });

// used on the contact list page to load all contacts
export const getContacts = () =>
  axios.get(`${API_BASE}/contacts`);

// used on the contact detail page and edit contact page to load one contact
export const getContact = (id) =>
  axios.get(`${API_BASE}/contacts/${id}`);

// used on the add contact page to save a new contact
export const addContact = (contact) =>
  axios.post(`${API_BASE}/contacts`, contact);

// used on the edit contact page to save changes to an existing contact
export const editContact = (id, contact) =>
  axios.put(`${API_BASE}/contacts/${id}`, contact);

// used on the contact detail page to delete a contact
export const deleteContact = (id) =>
  axios.delete(`${API_BASE}/contacts/${id}`);