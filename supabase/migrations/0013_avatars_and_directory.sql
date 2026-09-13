-- ============================================================
-- 0013: Avatar storage + extra public directory column
--
-- Employment type is not sensitive HR data (it's already visible as a
-- job attribute in most directories), so exposing it on the public
-- directory view lets every role filter/chart without reading the raw
-- employees table.
-- ============================================================

drop view if exists public_employee_directory;

create view public_employee_directory as
  select id, first_name, last_name, preferred_name, avatar_url,
         job_role_id, department_id, employment_type_id, location,
         employment_status, email
  from employees
  where deleted_at is null;

grant select on public_employee_directory to authenticated;

-- Avatars are public-read so the directory can render them for every role.
-- Writes are limited to HR/Admin or the employee whose id is the first
-- path segment (avatars/{employee_id}/...).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy avatars_select on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars');

create policy avatars_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (
      public.is_admin()
      or exists (
        select 1 from public.employees e
        where e.profile_id = auth.uid()
          and (storage.foldername(name))[1] = e.id::text
      )
    )
  );

create policy avatars_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (
      public.is_admin()
      or exists (
        select 1 from public.employees e
        where e.profile_id = auth.uid()
          and (storage.foldername(name))[1] = e.id::text
      )
    )
  )
  with check (
    bucket_id = 'avatars'
    and (
      public.is_admin()
      or exists (
        select 1 from public.employees e
        where e.profile_id = auth.uid()
          and (storage.foldername(name))[1] = e.id::text
      )
    )
  );

create policy avatars_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (
      public.is_admin()
      or exists (
        select 1 from public.employees e
        where e.profile_id = auth.uid()
          and (storage.foldername(name))[1] = e.id::text
      )
    )
  );
