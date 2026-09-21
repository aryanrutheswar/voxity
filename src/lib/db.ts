import { neon } from '@neondatabase/serverless';

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

function getNeonClient() {
  const connStr = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connStr) return null;
  return neon(connStr);
}

export const sql = getNeonClient();

class NeonDatabase {
  // In-memory fallback if Neon DATABASE_URL is not set
  private memoryLeads: LeadInquiry[] = [];
  private memoryBookings: Booking[] = [];
  private memorySubscribers: Subscriber[] = [];
  private memoryWorkTasks: WorkTask[] = [];
  private memoryOtps: Map<string, OtpRecord> = new Map();

  // --- Leads ---
  public async getLeads(): Promise<LeadInquiry[]> {
    const client = getNeonClient();
    if (client) {
      try {
        const rows = await client`
          SELECT id, name, email, company, service, budget, message, status, created_at as "createdAt"
          FROM leads
          ORDER BY created_at DESC;
        `;
        return rows as LeadInquiry[];
      } catch (e) {
        console.error('Neon getLeads error:', e);
      }
    }
    return this.memoryLeads;
  }

  public async addLead(lead: Omit<LeadInquiry, 'id' | 'status' | 'createdAt'>): Promise<LeadInquiry> {
    const newLead: LeadInquiry = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const client = getNeonClient();
    if (client) {
      try {
        await client`
          INSERT INTO leads (id, name, email, company, service, budget, message, status, created_at)
          VALUES (${newLead.id}, ${newLead.name}, ${newLead.email}, ${newLead.company}, ${newLead.service}, ${newLead.budget}, ${newLead.message}, ${newLead.status}, ${newLead.createdAt});
        `;
        return newLead;
      } catch (e) {
        console.error('Neon addLead error:', e);
      }
    }
    this.memoryLeads.unshift(newLead);
    return newLead;
  }

  public async updateLeadStatus(id: string, status: LeadInquiry['status']): Promise<LeadInquiry | null> {
    const client = getNeonClient();
    if (client) {
      try {
        await client`UPDATE leads SET status = ${status} WHERE id = ${id};`;
      } catch (e) {
        console.error('Neon updateLeadStatus error:', e);
      }
    }
    const lead = this.memoryLeads.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead || null;
  }

  public async deleteLead(id: string): Promise<boolean> {
    const client = getNeonClient();
    if (client) {
      try {
        await client`DELETE FROM leads WHERE id = ${id};`;
        return true;
      } catch (e) {
        console.error('Neon deleteLead error:', e);
      }
    }
    this.memoryLeads = this.memoryLeads.filter(l => l.id !== id);
    return true;
  }

  // --- Bookings ---
  public async getBookings(): Promise<Booking[]> {
    const client = getNeonClient();
    if (client) {
      try {
        const rows = await client`
          SELECT id, name, email, phone, slot, notes, audio_note as "audioNote", status, created_at as "createdAt"
          FROM bookings
          ORDER BY created_at DESC;
        `;
        return rows as Booking[];
      } catch (e) {
        console.error('Neon getBookings error:', e);
      }
    }
    return this.memoryBookings;
  }

  public async addBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    const client = getNeonClient();
    if (client) {
      try {
        await client`
          INSERT INTO bookings (id, name, email, phone, slot, notes, audio_note, status, created_at)
          VALUES (${newBooking.id}, ${newBooking.name}, ${newBooking.email}, ${newBooking.phone || null}, ${newBooking.slot}, ${newBooking.notes || null}, ${newBooking.audioNote || null}, ${newBooking.status}, ${newBooking.createdAt});
        `;
        return newBooking;
      } catch (e) {
        console.error('Neon addBooking error:', e);
      }
    }
    this.memoryBookings.unshift(newBooking);
    return newBooking;
  }

  public async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const client = getNeonClient();
    if (client) {
      try {
        await client`UPDATE bookings SET status = ${status} WHERE id = ${id};`;
      } catch (e) {
        console.error('Neon updateBookingStatus error:', e);
      }
    }
    const b = this.memoryBookings.find(item => item.id === id);
    if (b) b.status = status;
    return b || null;
  }

  public async deleteBooking(id: string): Promise<boolean> {
    const client = getNeonClient();
    if (client) {
      try {
        await client`DELETE FROM bookings WHERE id = ${id};`;
        return true;
      } catch (e) {
        console.error('Neon deleteBooking error:', e);
      }
    }
    this.memoryBookings = this.memoryBookings.filter(b => b.id !== id);
    return true;
  }

  // --- Subscribers ---
  public async getSubscribers(): Promise<Subscriber[]> {
    const client = getNeonClient();
    if (client) {
      try {
        const rows = await client`
          SELECT id, email, created_at as "createdAt"
          FROM subscribers
          ORDER BY created_at DESC;
        `;
        return rows as Subscriber[];
      } catch (e) {
        console.error('Neon getSubscribers error:', e);
      }
    }
    return this.memorySubscribers;
  }

  public async addSubscriber(email: string): Promise<Subscriber> {
    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email,
      createdAt: new Date().toISOString()
    };
    const client = getNeonClient();
    if (client) {
      try {
        await client`
          INSERT INTO subscribers (id, email, created_at)
          VALUES (${newSub.id}, ${newSub.email}, ${newSub.createdAt})
          ON CONFLICT (email) DO NOTHING;
        `;
        return newSub;
      } catch (e) {
        console.error('Neon addSubscriber error:', e);
      }
    }
    this.memorySubscribers.unshift(newSub);
    return newSub;
  }

  // --- Work Tasks ---
  public async getWorkTasks(): Promise<WorkTask[]> {
    const client = getNeonClient();
    if (client) {
      try {
        const rows = await client`
          SELECT id, title, client_name as "clientName", service_category as "serviceCategory", description, due_date as "dueDate", priority, status, created_at as "createdAt", proof
          FROM work_tasks
          ORDER BY created_at DESC;
        `;
        return rows as WorkTask[];
      } catch (e) {
        console.error('Neon getWorkTasks error:', e);
      }
    }
    return this.memoryWorkTasks;
  }

  public async addWorkTask(task: Omit<WorkTask, 'id' | 'status' | 'createdAt'>): Promise<WorkTask> {
    const newTask: WorkTask = {
      ...task,
      id: `task-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    const client = getNeonClient();
    if (client) {
      try {
        await client`
          INSERT INTO work_tasks (id, title, client_name, service_category, description, due_date, priority, status, created_at, proof)
          VALUES (${newTask.id}, ${newTask.title}, ${newTask.clientName}, ${newTask.serviceCategory}, ${newTask.description}, ${newTask.dueDate}, ${newTask.priority}, ${newTask.status}, ${newTask.createdAt}, ${newTask.proof ? JSON.stringify(newTask.proof) : null});
        `;
        return newTask;
      } catch (e) {
        console.error('Neon addWorkTask error:', e);
      }
    }
    this.memoryWorkTasks.unshift(newTask);
    return newTask;
  }

  public async updateWorkTask(id: string, updates: Partial<WorkTask>): Promise<WorkTask | null> {
    const client = getNeonClient();
    if (client) {
      try {
        if (updates.status) {
          await client`UPDATE work_tasks SET status = ${updates.status} WHERE id = ${id};`;
        }
        if (updates.proof !== undefined) {
          await client`UPDATE work_tasks SET proof = ${updates.proof ? JSON.stringify(updates.proof) : null} WHERE id = ${id};`;
        }
        if (updates.title) {
          await client`UPDATE work_tasks SET title = ${updates.title} WHERE id = ${id};`;
        }
        if (updates.priority) {
          await client`UPDATE work_tasks SET priority = ${updates.priority} WHERE id = ${id};`;
        }
      } catch (e) {
        console.error('Neon updateWorkTask error:', e);
      }
    }
    const task = this.memoryWorkTasks.find(w => w.id === id);
    if (task) Object.assign(task, updates);
    return task || null;
  }

  public async deleteWorkTask(id: string): Promise<boolean> {
    const client = getNeonClient();
    if (client) {
      try {
        await client`DELETE FROM work_tasks WHERE id = ${id};`;
        return true;
      } catch (e) {
        console.error('Neon deleteWorkTask error:', e);
      }
    }
    this.memoryWorkTasks = this.memoryWorkTasks.filter(w => w.id !== id);
    return true;
  }

  public async clearWorkTasks(): Promise<boolean> {
    const client = getNeonClient();
    if (client) {
      try {
        await client`DELETE FROM work_tasks;`;
        return true;
      } catch (e) {
        console.error('Neon clearWorkTasks error:', e);
      }
    }
    this.memoryWorkTasks = [];
    return true;
  }

  // --- OTPs ---
  public async generateOtp(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000;
    const client = getNeonClient();
    if (client) {
      try {
        await client`
          INSERT INTO otps (email, code, expires_at)
          VALUES (${email.toLowerCase()}, ${code}, ${expiresAt})
          ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at;
        `;
        return code;
      } catch (e) {
        console.error('Neon generateOtp error:', e);
      }
    }
    this.memoryOtps.set(email.toLowerCase(), { email, code, expiresAt });
    return code;
  }

  public async verifyOtp(email: string, code: string): Promise<boolean> {
    const client = getNeonClient();
    if (client) {
      try {
        const rows = await client`
          SELECT code, expires_at as "expiresAt"
          FROM otps
          WHERE email = ${email.toLowerCase()};
        `;
        if (rows.length > 0) {
          const record = rows[0];
          if (Date.now() > Number(record.expiresAt)) {
            await client`DELETE FROM otps WHERE email = ${email.toLowerCase()};`;
            return false;
          }
          if (record.code.trim() === code.trim()) {
            await client`DELETE FROM otps WHERE email = ${email.toLowerCase()};`;
            return true;
          }
          return false;
        }
      } catch (e) {
        console.error('Neon verifyOtp error:', e);
      }
    }
    const record = this.memoryOtps.get(email.toLowerCase());
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.memoryOtps.delete(email.toLowerCase());
      return false;
    }
    if (record.code.trim() === code.trim()) {
      this.memoryOtps.delete(email.toLowerCase());
      return true;
    }
    return false;
  }
}

const globalForDb = globalThis as unknown as { db: NeonDatabase };

export const db = globalForDb.db || new NeonDatabase();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
