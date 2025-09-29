# MMP Permissions and Verification

This document explains why you might see "Access Denied" when editing an MMP, how to fix it, and the recommended end‑to‑end verification flow.

## Why "Access Denied" appears when editing MMP

- **UI gate (not DB):** The block comes from `FieldTeamMapPermissions` in `src/components/map/FieldTeamMapPermissions.tsx`.
  - `EditMMP` wraps its content with:
    - `FieldTeamMapPermissions requiredAction="edit_mmp"` in `src/pages/EditMMP.tsx`.
  - Access is granted if either:
    - `hasPermission('edit_mmp')` returns true, OR
    - the user has one of these roles: `admin`, `ict`, `fom`, `supervisor` (checked via `hasRole()` which reads `public.user_roles`).

Common causes:
- **Missing permission mapping:** In `src/context/AppContext.tsx`, the admin permissions list does not include `'edit_mmp'`, so `hasPermission('edit_mmp')` is false even for admins.
- **No row in `user_roles`:** If the user’s profile says `admin` but the `public/user_roles` table does not contain a row `(user_id=<you>, role='admin')`, then `hasRole('admin')` returns false.
- **Not RLS:** In `supabase/schema.sql`, `mmp_files` has a permissive policy for authenticated users:
  ```sql
  alter table public.mmp_files enable row level security;
  create policy "mmp_files_all_auth" on public.mmp_files
    for all using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
  ```
  So, this denial is a client‑side check, not a database policy error.

## Fixes

- **Add the missing permission to admin (and other roles if desired):**
  ```ts
  // src/context/AppContext.tsx (inside permissionsByRole)
  admin: [
    'manage_users', 'approve_users', 'upload_mmp', 'approve_mmp',
    'verify_permits', 'assign_site_visits', 'view_all_site_visits',
    'view_finances', 'manage_finances', 'view_analytics', 'manage_settings',
    'edit_mmp',         // add this
    // 'verify_mmp',     // optional: add if you implement a verify action
  ],
  ```

- **Ensure the role exists in `user_roles`:**
  ```sql
  insert into public.user_roles (user_id, role)
  values ('<your_user_id>', 'admin')
  on conflict do nothing;
  ```
  Or use the hook function `useRoles().addRole(userId, 'admin')` from `src/hooks/use-roles.ts`.

- **Optional hardening:** Also consider allowing profile role directly in the gate:
  ```tsx
  // src/components/map/FieldTeamMapPermissions.tsx
  const { hasPermission, hasRole } = useAppContext();
  // const { currentUser } = useAppContext(); // if needed
  const canAccess = hasPermission(requiredAction)
    || hasRole('admin') || hasRole('ict') || hasRole('fom') || hasRole('supervisor');
    // || currentUser?.role === 'admin'; // optional
  ```

## Current MMP lifecycle (what exists)

- **Upload:** `uploadMMP` calls `uploadMMPFile()` (`src/utils/mmpFileUpload.ts`). We parse the uploaded Excel (.xlsx), count entries, validate headers, then insert into `public.mmp_files` with:
  - `status: 'pending'`
  - `workflow.currentStage: 'notStarted'`
  - `entries` and `site_entries` populated from the Excel
- **Status ops available:** `src/context/mmp/hooks/useMMPStatusOperations.ts` provides:
  - `approveMMP(id, approvedBy)` → sets `status: 'approved'`
  - `rejectMMP(id, rejectionReason)` → sets `status: 'rejected'`

## Recommended verification flow (additions)

Implement a dedicated verification step before approval.

1. **Permissions:** Add `'verify_mmp'` to the right roles in `permissionsByRole` in `src/context/AppContext.tsx`.
2. **Client action:** Add a new method in `src/context/mmp/hooks/useMMPStatusOperations.ts`:
   ```ts
   const verifyMMP = (id: string, verifiedBy: string) => {
     // 1) Update local state: set currentStage to 'verified' and recompute processedEntries
     setMMPFiles(prev => prev.map(m =>
       m.id === id
         ? {
             ...m,
             workflow: {
               ...(m.workflow || {}),
               currentStage: 'verified',
               lastUpdated: new Date().toISOString(),
             },
             processedEntries: m.siteEntries?.length ?? 0,
           }
         : m
     ));

     // 2) Persist to Supabase (handle snake_case on write)
     supabase.from('mmp_files')
       .update({
         workflow: { ...(/* existing */ {}), currentStage: 'verified', lastUpdated: new Date().toISOString() },
         processed_entries: /* recomputed */ 0,
       })
       .eq('id', id);

     toast.success('MMP verified');
   };
   ```
3. **UI control:** Add a "Verify" button (e.g., in `MMPDetailView` or a verification tab) that calls `verifyMMP`, visible only to users passing `FieldTeamMapPermissions requiredAction="verify_mmp"`.
4. **Post‑verify actions:**
   - Optionally flag entries, attach validation summaries, and persist any warnings.
   - Now handoff to approval: `approveMMP()` can be run after verification.

## Quick checklist

- **Add permission mapping:** `'edit_mmp'` (and optionally `'verify_mmp'`) under admin in `src/context/AppContext.tsx`.
- **Ensure roles:** Your user must have `'admin'` in `public.user_roles` for `hasRole('admin')` to pass.
- **Optional:** Accept profile role directly in the permission component if desired.
- **Implement verify:** Add `verifyMMP` method, and a UI action guarded by `verify_mmp`.

With these steps, admins will be able to edit MMPs and the verification flow will be explicit and auditable.
