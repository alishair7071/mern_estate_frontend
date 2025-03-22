

import { createClient } from "@supabase/supabase-js";

// Use environment variables for security
const supabaseUrl = 'https://euujuydpjdybjgezyptb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dWp1eWRwamR5YmpnZXp5cHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMTM0NDksImV4cCI6MjA1Njg4OTQ0OX0.HcdniuCpIrGWKITIT8a8pShxPhIScS3NOP_z_9kjEsQ';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const printSupabase= ()=>{
    console.log(supabase);
}
