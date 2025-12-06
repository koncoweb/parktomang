
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** networkasro
- **Date:** 2025-12-06
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Login with Valid Credentials
- **Test Code:** [TC001_Login_with_Valid_Credentials.py](./TC001_Login_with_Valid_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/f358a22d-7756-48e2-889f-eb785bf849e5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Login with Invalid Credentials
- **Test Code:** [TC002_Login_with_Invalid_Credentials.py](./TC002_Login_with_Invalid_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/ce1bfc4e-2639-43ab-82ce-a90aa4218f85
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** User Registration with Valid Data
- **Test Code:** [TC003_User_Registration_with_Valid_Data.py](./TC003_User_Registration_with_Valid_Data.py)
- **Test Error:** Registration validation failed due to persistent 'User already registered' errors with unique emails and no success confirmation. Role assignment validation could not be performed. Stopping further testing and reporting the issue.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
[ERROR] Failed to load resource: the server responded with a status of 422 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/signup:0:0)
[ERROR] Failed to load resource: the server responded with a status of 406 () (at https://eooytmbkngxdoregtkyi.supabase.co/rest/v1/user_profiles?select=*&user_id=eq.86b2206b-4c30-4aaa-882f-6b4fa0988a45:0:0)
[ERROR] Error fetching profile: {code: PGRST116, details: The result contains 0 rows, hint: null, message: Cannot coerce the result to a single JSON object} (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Failed to load resource: the server responded with a status of 422 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/signup:0:0)
[ERROR] Failed to load resource: the server responded with a status of 406 () (at https://eooytmbkngxdoregtkyi.supabase.co/rest/v1/user_profiles?select=*&user_id=eq.bf24360a-942d-447a-b0a5-452d736f4fe4:0:0)
[ERROR] Error fetching profile: {code: PGRST116, details: The result contains 0 rows, hint: null, message: Cannot coerce the result to a single JSON object} (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/afa2a0b3-86e5-4cd6-b68f-d58c717e4878
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Role-Based Access Control Enforcement
- **Test Code:** [TC004_Role_Based_Access_Control_Enforcement.py](./TC004_Role_Based_Access_Control_Enforcement.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/b76c9bce-af85-40ce-8c73-bdc0611054a5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Customer Management CRUD Operations
- **Test Code:** [TC005_Customer_Management_CRUD_Operations.py](./TC005_Customer_Management_CRUD_Operations.py)
- **Test Error:** Tested create, read, and update customer records successfully. However, the delete functionality failed as the customer record was not removed after clicking delete. Validation for invalid data was not tested due to this failure. Stopping further testing.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/267a4db4-ad10-407b-8e03-a55e61020b90
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Customer Search and Filter Functionality
- **Test Code:** [TC006_Customer_Search_and_Filter_Functionality.py](./TC006_Customer_Search_and_Filter_Functionality.py)
- **Test Error:** The customer list page search and filter functionality could not be verified because the search input field is non-interactive and does not accept input or activate filters. Further testing is stopped due to this issue.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/1141ccfb-181a-4a86-a35c-cd6a263bf3a7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Invoice Status Transitions and Payment Input
- **Test Code:** [TC007_Invoice_Status_Transitions_and_Payment_Input.py](./TC007_Invoice_Status_Transitions_and_Payment_Input.py)
- **Test Error:** Invoice status update after payment action failed. Payment processing and status update functionality is broken. Stopping further testing.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://eooytmbkngxdoregtkyi.supabase.co/rest/v1/invoices?id=eq.6f55fcb3-40ef-4ea0-902f-bbbd5ad04b01:0:0)
[ERROR] Error updating invoice status: {code: 42703, details: null, hint: Perhaps you meant to reference the column "i.customer_id"., message: column c.customer_id does not exist} (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/f20a2087-f28d-4746-87ac-8f5aa4ad5d01
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Automatic Invoice Creation 7 Days Before Due Date
- **Test Code:** [TC008_Automatic_Invoice_Creation_7_Days_Before_Due_Date.py](./TC008_Automatic_Invoice_Creation_7_Days_Before_Due_Date.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/ada1b358-256a-4950-9175-d1ae277efad6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Package Management CRUD with Validation
- **Test Code:** [TC009_Package_Management_CRUD_with_Validation.py](./TC009_Package_Management_CRUD_with_Validation.py)
- **Test Error:** Testing of full management of internet packages including add, edit, and delete is stopped due to failure in deletion functionality. The package 'Paket 120 Mbps' could not be deleted as expected. Add and edit functionalities were successful. Validation tests for invalid input were not performed due to this blocking issue.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/4f927f36-7d86-40b5-97f5-7ae9efc90fe9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Commission Calculation and Tracking for Sales
- **Test Code:** [TC010_Commission_Calculation_and_Tracking_for_Sales.py](./TC010_Commission_Calculation_and_Tracking_for_Sales.py)
- **Test Error:** The task to verify commissions for sales users was partially completed. We successfully logged in as the owner, viewed commission settings, added a new customer, and confirmed billing creation. However, commissions did not generate automatically after billing, and payment tracking could not be verified. Additionally, login as the sales user 'noval' failed due to invalid credentials, preventing further verification from the sales user perspective. Therefore, the task is not fully finished.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/logout?scope=global:0:0)
[ERROR] Error signing out: AuthSessionMissingError: Auth session missing!
    at handleError (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188009:13)
    at async _handleRequest (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188061:7)
    at async _request (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188041:18)
    at async GoTrueAdminApi.signOut (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:187471:9)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191287:15
    at async SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:16)
    at async SupabaseAuthClient._signOut (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191272:14)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191264:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/token?grant_type=password:0:0)
[ERROR] Sign in error: AuthApiError: Invalid login credentials
    at handleError (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188011:11)
    at async _handleRequest (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188061:7)
    at async _request (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188041:18)
    at async SupabaseAuthClient.signInWithPassword (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:189834:17)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:86705:13
    at async t0 (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:172918:13) (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/cfe7f91d-399b-487a-945e-4b9a88beb0e3
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Dashboard Displays Accurate Role-Based Statistics
- **Test Code:** [TC011_Dashboard_Displays_Accurate_Role_Based_Statistics.py](./TC011_Dashboard_Displays_Accurate_Role_Based_Statistics.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/716fd899-6cd5-4670-9a07-ec8565b64fd8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** User Management by Owner
- **Test Code:** [TC012_User_Management_by_Owner.py](./TC012_User_Management_by_Owner.py)
- **Test Error:** User creation with specific roles was successful. However, the user role modification functionality is not available or accessible in the current user management interface. The 'Hapus' button only allows user deletion. Validation error testing for user creation was not performed due to session logout after user creation. Stopping further testing due to missing role modification feature.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/admin/users:0:0)
[ERROR] Failed to load resource: the server responded with a status of 406 () (at https://eooytmbkngxdoregtkyi.supabase.co/rest/v1/user_profiles?select=*&user_id=eq.e48c4dad-1b63-4f5f-9d9f-22b7c0c42c64:0:0)
[ERROR] Error fetching profile: {code: PGRST116, details: The result contains 0 rows, hint: null, message: Cannot coerce the result to a single JSON object} (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/user:0:0)
[ERROR] Error restoring session: AuthSessionMissingError: Auth session missing!
    at handleError (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188009:13)
    at async _handleRequest (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188061:7)
    at async _request (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188041:18)
    at async SupabaseAuthClient._getUser (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190845:18)
    at async SupabaseAuthClient._setSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191015:15)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190968:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Error creating user: Error: Gagal mengembalikan session. Silakan login ulang.
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:87052:24
    at async handleCreateUser (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:163792:13) (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/2ec56635-fcaa-46b4-ba69-09bbe1077082
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Date and Currency Format Validation
- **Test Code:** [TC013_Date_and_Currency_Format_Validation.py](./TC013_Date_and_Currency_Format_Validation.py)
- **Test Error:** Verification of date and currency formats in Indonesian locale is partially complete. Currency displays consistently use 'Rp' with dot separators and decimal points as per Indonesian format. Currency input fields accept valid numeric inputs and reject invalid formats with commas. Date displays on Tagihan page use Indonesian month names and format. However, no date input fields were found to test date input validation, and attempts to access the 'Pelanggan' tab to find such inputs failed due to missing interactive elements. Overall, the task is partially finished due to inability to fully verify date input formats.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/bc2c5deb-abd9-4ba4-b189-9818ca9bd065
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Responsive UI and iOS 16 Design Compliance
- **Test Code:** [TC014_Responsive_UI_and_iOS_16_Design_Compliance.py](./TC014_Responsive_UI_and_iOS_16_Design_Compliance.py)
- **Test Error:** Web platform dashboard UI verified. Next step is to launch the application on iOS device or simulator to check UI elements against iOS 16 style guide.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/3b5667e4-c7a5-45e8-8dfa-d0af48f16c7f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Routing and Navigation Protection Based on Role
- **Test Code:** [TC015_Routing_and_Navigation_Protection_Based_on_Role.py](./TC015_Routing_and_Navigation_Protection_Based_on_Role.py)
- **Test Error:** Testing stopped due to critical 6000ms timeout error on logout action. Owner role access verified but unable to test other roles or unauthorized access due to logout failure. Please fix the timeout error to continue testing.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Animated: `useNativeDriver` is not supported because the native animated module is missing. Falling back to JS-based animation. To resolve this, add `RCTAnimation` module to this app, or remove `useNativeDriver`. Make sure to run `bundle exec pod install` first. Read more about autolinking: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:38188:16)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/d8a732e0-5809-4d7c-a726-02175586c11a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Sign Out and Session Management
- **Test Code:** [TC016_Sign_Out_and_Session_Management.py](./TC016_Sign_Out_and_Session_Management.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/6cd60525-137b-4d17-8f0f-a832bb935acb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** Error Handling on Network or Server Failure
- **Test Code:** [TC017_Error_Handling_on_Network_or_Server_Failure.py](./TC017_Error_Handling_on_Network_or_Server_Failure.py)
- **Test Error:** Testing for backend failure simulation and user feedback completed. The application failed to provide proper error messages or notifications during backend failure and retry attempts on user creation. The form remains open without indication of success or failure. Stopping further testing.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/admin/users:0:0)
[ERROR] Failed to load resource: the server responded with a status of 422 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/signup:0:0)
[ERROR] Error creating user: AuthApiError: User already registered
    at handleError (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188011:11)
    at async _handleRequest (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188061:7)
    at async _request (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188041:18)
    at async SupabaseAuthClient.signUp (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:189741:17)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:87012:15
    at async handleCreateUser (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:163792:13) (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/admin/users:0:0)
[ERROR] Failed to load resource: the server responded with a status of 422 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/signup:0:0)
[ERROR] Error creating user: AuthApiError: User already registered
    at handleError (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188011:11)
    at async _handleRequest (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188061:7)
    at async _request (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188041:18)
    at async SupabaseAuthClient.signUp (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:189741:17)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:87012:15
    at async handleCreateUser (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:163792:13) (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/e3772d6d-c2e6-4ef3-8812-2c63d86d6fed
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** Cross-Platform Compatibility
- **Test Code:** [TC018_Cross_Platform_Compatibility.py](./TC018_Cross_Platform_Compatibility.py)
- **Test Error:** User deletion failed on Web platform, preventing full CRUD verification. Reported issue and stopping further Web platform testing. Ready to proceed with iOS and Android platform testing to verify feature parity.
Browser Console Logs:
[WARNING] "shadow*" style props are deprecated. Use "boxShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] "textShadow*" style props are deprecated. Use "textShadow". (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] Image: style.resizeMode is deprecated. Please use props.resizeMode. (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[ERROR] Error refreshing session: AuthSessionMissingError: Auth session missing!
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191077:19
    at SupabaseAuthClient._useSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190733:22)
    at async SupabaseAuthClient._refreshSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191064:16)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191059:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[WARNING] props.pointerEvents is deprecated. Use style.pointerEvents (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:23447:14)
[WARNING] Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
       (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:71861:14)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/admin/users:0:0)
[ERROR] Failed to load resource: the server responded with a status of 406 () (at https://eooytmbkngxdoregtkyi.supabase.co/rest/v1/user_profiles?select=*&user_id=eq.11c20baf-6913-434e-ba5b-9e25b0abfebb:0:0)
[ERROR] Error fetching profile: {code: PGRST116, details: The result contains 0 rows, hint: null, message: Cannot coerce the result to a single JSON object} (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://eooytmbkngxdoregtkyi.supabase.co/auth/v1/user:0:0)
[ERROR] Error restoring session: AuthSessionMissingError: Auth session missing!
    at handleError (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188009:13)
    at async _handleRequest (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188061:7)
    at async _request (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:188041:18)
    at async SupabaseAuthClient._getUser (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190845:18)
    at async SupabaseAuthClient._setSession (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:191015:15)
    at async http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:190968:16 (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Error creating user: Error: Gagal mengembalikan session. Silakan login ulang.
    at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:87052:24
    at async handleCreateUser (http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:163792:13) (at http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=app&transform.reactCompiler=true:2508:32)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8081/assets/?unstable_path=.%2Fassets%2Fimages/banner.jpg:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f31f0ff-f170-4cfd-9ccb-971958132a60/896af5ba-e1cb-4e52-bedf-4c865453213e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **33.33** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---