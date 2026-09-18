export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: 'New' | 'Contacted' | 'Won' | 'Lost';
  createdAt: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  slot: string;
  notes?: string;
  audioNote?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface WorkTask {
  id: string;
  title: string;
  clientName: string;
  serviceCategory: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Proof Submitted' | 'Completed';
  createdAt: string;
  proof?: {
    uploadedAt: string;
    proofType: 'Screenshot/Image' | 'Live Link' | 'Document/File';
    proofDataOrUrl: string;
    notes: string;
    verifiedByAdmin: boolean;
    verifiedAt?: string;
  };
}

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
}

export const ADMIN_EMAIL = 'aryanrutheswar1823@gmail.com';

class Database {
  private leads: LeadInquiry[] = [];
  private bookings: Booking[] = [];
  private subscribers: Subscriber[] = [];
  private workTasks: WorkTask[] = [];
  private otps: Map<string, OtpRecord> = new Map();

  public getLeads() { return this.leads; }
  public addLead(lead: Omit<LeadInquiry, 'id' | 'status' | 'createdAt'>) {
    const newLead: LeadInquiry = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    return newLead;
  }
  public updateLeadStatus(id: string, status: LeadInquiry['status']) {
    const lead = this.leads.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead;
  }
  public deleteLead(id: string) {
    this.leads = this.leads.filter(l => l.id !== id);
    return true;
  }

  public getBookings() { return this.bookings; }
  public addBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) {
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }
  public updateBookingStatus(id: string, status: Booking['status']) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) booking.status = status;
    return booking;
  }
  public deleteBooking(id: string) {
    this.bookings = this.bookings.filter(b => b.id !== id);
    return true;
  }

  public getSubscribers() { return this.subscribers; }
  public addSubscriber(email: string) {
    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email,
      createdAt: new Date().toISOString()
    };
    this.subscribers.unshift(newSub);
    return newSub;
  }

  public generateOtp(email: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000;
    this.otps.set(email.toLowerCase(), { email, code, expiresAt });
    return code;
  }

  public verifyOtp(email: string, code: string): boolean {
    const record = this.otps.get(email.toLowerCase());
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.otps.delete(email.toLowerCase());
      return false;
    }
    if (record.code.trim() === code.trim()) {
      this.otps.delete(email.toLowerCase());
      return true;
    }
    return false;
  }

  public getWorkTasks() { return this.workTasks; }
  public addWorkTask(task: Omit<WorkTask, 'id' | 'status' | 'createdAt'>) {
    const newTask: WorkTask = {
      ...task,
      id: `task-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    this.workTasks.unshift(newTask);
    return newTask;
  }
  public updateWorkTask(id: string, updates: Partial<WorkTask>) {
    const task = this.workTasks.find(w => w.id === id);
    if (task) {
      Object.assign(task, updates);
    }
    return task;
  }
  public deleteWorkTask(id: string) {
    this.workTasks = this.workTasks.filter(w => w.id !== id);
    return true;
  }
  public clearWorkTasks() {
    this.workTasks = [];
    return true;
  }
}

const globalForDb = globalThis as unknown as { db: Database };

if (globalForDb.db && typeof (globalForDb.db as any).updateWorkTask !== 'function') {
  delete (globalForDb as any).db;
}

export const db = globalForDb.db || new Database();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
