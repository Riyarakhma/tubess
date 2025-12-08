// Child Class - SupabaseService (Inheritance & Polymorphism)
import { DatabaseService } from './DatabaseService.js';
import { 
  DatabaseConnectionError, 
  DataRetrievalError, 
  DataInsertionError 
} from './Exceptions.js';
import { supabase } from '../utils/supabaseClient.js';

export class SupabaseService extends DatabaseService {
  constructor() {
    super();
    this.client = supabase;
    this.connected = false;
  }
  
  // Override method connect
  async connect() {
    try {
      // Test connection dengan query sederhana
      const { data, error } = await this.client
        .from('routes')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      this.connected = true;
      this.log('Connected to Supabase successfully', 'success');
      return { success: true, message: "Connected to Supabase" };
    } catch (error) {
      this.log(`Connection failed: ${error.message}`, 'error');
      throw new DatabaseConnectionError(`Failed to connect to Supabase: ${error.message}`);
    }
  }
  
  // Override method getData
  async getData(table, filters = null) {
    if (!this.connected) {
      throw new DatabaseConnectionError("Not connected to database");
    }
    
    try {
      let query = this.client.from(table).select('*');
      
      // Apply filters if provided
      if (filters) {
        Object.keys(filters).forEach(key => {
          query = query.eq(key, filters[key]);
        });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      this.log(`Retrieved ${data.length} records from ${table}`, 'info');
      return data;
    } catch (error) {
      this.log(`Failed to get data from ${table}: ${error.message}`, 'error');
      throw new DataRetrievalError(`Failed to retrieve data from ${table}: ${error.message}`);
    }
  }
  
  // Override method insertData
  async insertData(table, data) {
    if (!this.connected) {
      throw new DatabaseConnectionError("Not connected to database");
    }
    
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select();
      
      if (error) throw error;
      
      this.log(`Inserted data into ${table}`, 'success');
      return { success: true, data: result };
    } catch (error) {
      this.log(`Failed to insert data into ${table}: ${error.message}`, 'error');
      throw new DataInsertionError(`Failed to insert data into ${table}: ${error.message}`);
    }
  }
  
  // Override method updateData
  async updateData(table, id, data) {
    if (!this.connected) {
      throw new DatabaseConnectionError("Not connected to database");
    }
    
    try {
      const { data: result, error } = await this.client
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      this.log(`Updated record ${id} in ${table}`, 'success');
      return { success: true, data: result };
    } catch (error) {
      this.log(`Failed to update ${table}: ${error.message}`, 'error');
      throw new DataInsertionError(`Failed to update ${table}: ${error.message}`);
    }
  }
  
  // Override method deleteData
  async deleteData(table, id) {
    if (!this.connected) {
      throw new DatabaseConnectionError("Not connected to database");
    }
    
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      this.log(`Deleted record ${id} from ${table}`, 'success');
      return { success: true };
    } catch (error) {
      this.log(`Failed to delete from ${table}: ${error.message}`, 'error');
      throw new DataInsertionError(`Failed to delete from ${table}: ${error.message}`);
    }
  }
  
  // Method khusus untuk subscribe real-time updates
  subscribeToTable(table, callback) {
    const channel = this.client
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => {
          this.log(`Real-time update on ${table}`, 'info');
          callback(payload);
        }
      )
      .subscribe();
    
    return channel;
  }
  
  // Method untuk unsubscribe
  async unsubscribe(channel) {
    await this.client.removeChannel(channel);
    this.log('Unsubscribed from channel', 'info');
  }
  
  // Method untuk update posisi bus (optimized)
  async updateBusPosition(busId, lat, lng) {
    try {
      const { error } = await this.client
        .from('buses')
        .update({ 
          lat, 
          lng, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', busId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      throw new DataInsertionError(`Failed to update bus position: ${error.message}`);
    }
  }
}