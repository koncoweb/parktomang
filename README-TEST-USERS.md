# Cara Membuat Test Users untuk ASRO Network

## Opsi 1: Menggunakan Supabase Dashboard (Paling Mudah)

1. Buka Supabase Dashboard → Authentication → Users
2. Klik "Add User" untuk setiap user berikut:

### User Owner
- **Email**: `owner@asro.network`
- **Password**: `owner123456`
- **Auto Confirm User**: ✅ (centang)

### User Admin
- **Email**: `admin@asro.network`
- **Password**: `admin123456`
- **Auto Confirm User**: ✅ (centang)

### User Sales
- **Email**: `sales@asro.network`
- **Password**: `sales123456`
- **Auto Confirm User**: ✅ (centang)

3. Setelah ketiga user dibuat, buka SQL Editor di Supabase Dashboard
4. Copy dan jalankan SQL dari file `scripts/create-test-users.sql`

## Opsi 2: Menggunakan Script Node.js

1. Dapatkan **Service Role Key** dari Supabase Dashboard:
   - Settings → API → service_role key (secret)

2. Tambahkan ke `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Jalankan script:
   ```bash
   node scripts/create-test-users.js
   ```

## Credentials untuk Login

Setelah user dibuat, gunakan credentials berikut untuk login:

| Role | Email | Password |
|------|-------|----------|
| **Owner** | owner@asro.network | owner123456 |
| **Admin** | admin@asro.network | admin123456 |
| **Sales** | sales@asro.network | sales123456 |

## Verifikasi

Setelah membuat user, verifikasi dengan menjalankan query berikut di SQL Editor:

```sql
SELECT 
  up.full_name,
  up.role,
  au.email,
  up.created_at
FROM user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE au.email IN ('owner@asro.network', 'admin@asro.network', 'sales@asro.network')
ORDER BY up.role;
```

