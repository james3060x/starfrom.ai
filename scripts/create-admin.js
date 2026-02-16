const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const email = process.argv[2] || 'admin@starfrom.ai'
  const password = process.argv[3] || 'Admin123!'

  console.log(`Creating admin user: ${email}`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    console.error('Error creating user:', error.message)
    process.exit(1)
  }

  console.log('Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('User ID:', data.user.id)
}

createAdminUser()
