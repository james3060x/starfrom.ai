const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://ccesxdggmqrbfgsunsod.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXN4ZGdnbXFyYmZnc3Vuc29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTY4NDQ0MiwiZXhwIjoyMDU1MjYwNDQyfQ.U6R0cHVy3tjoB6PrLXltR9UcLi8cOYSUWWvlZCRbOvQ'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function runMigration() {
  const sql = fs.readFileSync('supabase/migrations/001_init.sql', 'utf8')
  
  // Try to execute via REST API query endpoint
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'tx=commit'
      },
      body: JSON.stringify({
        query: sql
      })
    })
    
    const text = await response.text()
    console.log('Response:', text)
  } catch (e) {
    console.error('Error:', e.message)
  }
}

runMigration()
