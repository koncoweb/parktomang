-- SQL Script untuk membuat test user profiles
-- CATATAN PENTING: User auth harus dibuat terlebih dahulu melalui Supabase Dashboard
-- atau menggunakan script Node.js: node scripts/create-test-users.js

-- Langkah 1: Buat user auth melalui Supabase Dashboard (Authentication > Users > Add User)
-- atau jalankan: node scripts/create-test-users.js

-- Langkah 2: Setelah user auth dibuat, jalankan query di bawah ini untuk membuat profiles

-- Untuk Owner
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'owner@asro.network' 
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    PERFORM create_test_user_profile(v_user_id, 'Owner ASRO', 'owner');
    RAISE NOTICE 'Profile untuk owner@asro.network berhasil dibuat';
  ELSE
    RAISE NOTICE 'User owner@asro.network belum ada di auth.users. Buat user terlebih dahulu.';
  END IF;
END $$;

-- Untuk Admin
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'admin@asro.network' 
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    PERFORM create_test_user_profile(v_user_id, 'Admin ASRO', 'admin');
    RAISE NOTICE 'Profile untuk admin@asro.network berhasil dibuat';
  ELSE
    RAISE NOTICE 'User admin@asro.network belum ada di auth.users. Buat user terlebih dahulu.';
  END IF;
END $$;

-- Untuk Sales
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'sales@asro.network' 
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    PERFORM create_test_user_profile(v_user_id, 'Sales ASRO', 'sales');
    RAISE NOTICE 'Profile untuk sales@asro.network berhasil dibuat';
  ELSE
    RAISE NOTICE 'User sales@asro.network belum ada di auth.users. Buat user terlebih dahulu.';
  END IF;
END $$;

-- Verifikasi profiles yang dibuat
SELECT 
  up.id,
  up.full_name,
  up.role,
  au.email,
  up.created_at
FROM user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE au.email IN ('owner@asro.network', 'admin@asro.network', 'sales@asro.network')
ORDER BY up.role;

