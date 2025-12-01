# Cara Membuat Test Users

Ada 2 cara untuk membuat test users:

## Cara 1: Menggunakan Script Node.js (Recommended)

1. Pastikan Anda memiliki **Service Role Key** dari Supabase Dashboard
2. Tambahkan ke `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Jalankan script:
   ```bash
   node scripts/create-test-users.js
   ```

## Cara 2: Manual via Supabase Dashboard

1. Buka Supabase Dashboard → Authentication → Users
2. Klik "Add User" untuk setiap user berikut:

### User 1: Owner
- Email: `owner@asro.network`
- Password: `owner123456`
- Auto Confirm: ✅

### User 2: Admin
- Email: `admin@asro.network`
- Password: `admin123456`
- Auto Confirm: ✅

### User 3: Sales
- Email: `sales@asro.network`
- Password: `sales123456`
- Auto Confirm: ✅

3. Setelah user dibuat, jalankan SQL berikut di SQL Editor untuk membuat profiles:

```sql
-- Dapatkan user_id dari auth.users terlebih dahulu
-- Ganti user_id dengan ID yang sesuai dari auth.users

-- Untuk Owner
SELECT create_test_user_profile(
  (SELECT id FROM auth.users WHERE email = 'owner@asro.network' LIMIT 1),
  'Owner ASRO',
  'owner'
);

-- Untuk Admin
SELECT create_test_user_profile(
  (SELECT id FROM auth.users WHERE email = 'admin@asro.network' LIMIT 1),
  'Admin ASRO',
  'admin'
);

-- Untuk Sales
SELECT create_test_user_profile(
  (SELECT id FROM auth.users WHERE email = 'sales@asro.network' LIMIT 1),
  'Sales ASRO',
  'sales'
);
```

## Credentials untuk Login

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@asro.network | owner123456 |
| Admin | admin@asro.network | admin123456 |
| Sales | sales@asro.network | sales123456 |

