import { type User, type InsertUser, type Lead, type InsertLead, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.contacts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      ...insertLead,
      message: insertLead.message ?? null,
      phone: insertLead.phone ?? null,
      id, 
      createdAt: new Date() 
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    
    // Calculate lead score based on responses
    let leadScore = 0;
    if (insertContact.budget === "100k+") leadScore += 30;
    else if (insertContact.budget === "50k-100k") leadScore += 25;
    else if (insertContact.budget === "15k-50k") leadScore += 20;
    else leadScore += 10;
    
    if (insertContact.timeline === "asap") leadScore += 20;
    else if (insertContact.timeline === "1-3months") leadScore += 15;
    else if (insertContact.timeline === "3-6months") leadScore += 10;
    else leadScore += 5;
    
    if (insertContact.employeeCount === "1000+") leadScore += 20;
    else if (insertContact.employeeCount === "201-999") leadScore += 15;
    else if (insertContact.employeeCount === "51-200") leadScore += 10;
    else leadScore += 5;
    
    if (insertContact.interestedModules.length >= 3) leadScore += 15;
    else if (insertContact.interestedModules.length >= 2) leadScore += 10;
    else leadScore += 5;

    const contact: Contact = { 
      ...insertContact,
      website: insertContact.website || null,
      phone: insertContact.phone || null,
      additionalInfo: insertContact.additionalInfo || null,
      acceptPrivacy: insertContact.acceptPrivacy || "false",
      acceptNewsletter: insertContact.acceptNewsletter || "false",
      leadScore: leadScore.toString(),
      status: "new",
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (contact) {
      const updatedContact = { ...contact, status };
      this.contacts.set(id, updatedContact);
      return updatedContact;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
