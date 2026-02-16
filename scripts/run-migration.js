const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: {
    schema: 'public'
  }
})

async function runMigration() {
  const sql = fs.readFileSync('supabase/migrations/001_init.sql', 'utf8')
  
  // Split by semicolon to execute statements individually
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  console.log(`Found ${statements.length} SQL statements to execute`)
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';'
    try {
      const { error } = await supabase.rpc('exec_sql', { query: stmt })
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message)
        console.error('Statement:', stmt.substring(0, 100) + '...')
      } else {
        console.log(`✓ Statement ${i + 1} executed successfully`)
      }
    } catch (e) {
      console.error(`Exception on statement ${i + 1}:`, e.message)
    }
  }
  
  console.log('\nMigration completed!')
}

runMigration()
