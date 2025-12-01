/**
 * Script untuk membuat 3 user test (owner, admin, sales)
 * Jalankan dengan: node scripts/create-test-users.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Error: EXPO_PUBLIC_SUPABASE_URL tidak ditemukan di .env.local');
  process.exit(1);
}

// Gunakan service role key jika ada, jika tidak gunakan anon key (mungkin tidak akan berhasil untuk create user)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'owner@asro.network',
    password: 'owner123456',
    fullName: 'Owner ASRO',
    role: 'owner'
  },
  {
    email: 'admin@asro.network',
    password: 'admin123456',
    fullName: 'Admin ASRO',
    role: 'admin'
  },
  {
    email: 'sales@asro.network',
    password: 'sales123456',
    fullName: 'Sales ASRO',
    role: 'sales'
  }
];

async function createTestUsers() {
  console.log('🚀 Membuat test users...\n');

  for (const user of testUsers) {
    try {
      console.log(`📝 Membuat user: ${user.email} (${user.role})...`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true // Auto confirm email
      });

      if (authError) {
        // Jika user sudah ada, coba get user yang sudah ada
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${user.email} sudah ada, menggunakan user yang sudah ada...`);
          
          // Get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(u => u.email === user.email);
          
          if (existingUser) {
            // Create or update profile
            const { error: profileError } = await supabase
              .from('user_profiles')
              .upsert({
                user_id: existingUser.id,
                full_name: user.fullName,
                role: user.role,
                phone: null
              }, {
                onConflict: 'user_id'
              });

            if (profileError) {
              console.error(`❌ Error membuat profile untuk ${user.email}:`, profileError.message);
            } else {
              console.log(`✅ Profile untuk ${user.email} berhasil dibuat/diupdate\n`);
            }
          }
          continue;
        }
        
        console.error(`❌ Error membuat user ${user.email}:`, authError.message);
        continue;
      }

      if (!authData?.user) {
        console.error(`❌ User ${user.email} tidak berhasil dibuat`);
        continue;
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          full_name: user.fullName,
          role: user.role,
          phone: null
        });

      if (profileError) {
        console.error(`❌ Error membuat profile untuk ${user.email}:`, profileError.message);
      } else {
        console.log(`✅ User ${user.email} berhasil dibuat dengan role ${user.role}\n`);
      }

    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }

  console.log('\n✨ Selesai!');
  console.log('\n📋 Credentials untuk login:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testUsers.forEach(user => {
    console.log(`\nRole: ${user.role.toUpperCase()}`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

createTestUsers().catch(console.error);

