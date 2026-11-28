-- EgvoX Phase 02 Identity & Organizations. Reviewed artifact only; not applied to hosted production.
begin;
create extension if not exists pgcrypto with schema extensions;
create table public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text, phone text, country_code char(2), city text, bio text,
 status text not null default 'active' check(status in('active','suspended','deleted')),
 onboarding_completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_preferences(
 user_id uuid primary key references public.profiles(id) on delete cascade,
 locale text not null default 'id' check(locale in('id','en')),
 timezone text not null default 'Asia/Jakarta',
 active_organization_id uuid, updated_at timestamptz not null default now()
);
create table public.roles(id text primary key,scope text not null check(scope in('persona','organization','platform')),display_name text not null,is_privileged boolean not null default false);
create table public.permissions(id text primary key,description text not null);
create table public.role_permissions(role_id text references public.roles(id) on delete cascade,permission_id text references public.permissions(id) on delete cascade,primary key(role_id,permission_id));
create table public.organizations(
 id uuid primary key default gen_random_uuid(),kind text not null check(kind in('vendor','enterprise')),
 legal_name text not null,trading_name text,country_code char(2) not null,registration_identifier text not null,
 website text,business_email text not null,address jsonb not null default '{}'::jsonb,industry text not null,
 contact_person text not null,authorized_representative text not null,business_purpose text not null,
 verification_status text not null default 'submitted' check(verification_status in('draft','submitted','under_review','changes_requested','approved','rejected')),
 catalog_publishing_enabled boolean not null default false,verified_at timestamptz,
 created_by uuid not null references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(country_code,registration_identifier)
);
alter table public.user_preferences add constraint user_preferences_active_org_fk foreign key(active_organization_id) references public.organizations(id) on delete set null;
create table public.organization_members(
 id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.organizations(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,role_id text not null references public.roles(id),
 status text not null default 'active' check(status in('invited','active','suspended','removed')),
 created_by uuid not null references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(organization_id,user_id)
);
create table public.organization_invitations(
 id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.organizations(id) on delete cascade,
 email text not null,role_id text not null references public.roles(id),token_hash text not null unique check(length(token_hash)=64),
 status text not null default 'pending' check(status in('pending','accepted','rejected','revoked','expired')),
 expires_at timestamptz not null,invited_by uuid not null references public.profiles(id),
 accepted_by uuid references public.profiles(id),responded_at timestamptz,created_at timestamptz not null default now()
);
create unique index organization_invitations_pending_email_key on public.organization_invitations(organization_id,lower(email)) where status='pending';
create index organization_members_user_status_idx on public.organization_members(user_id,status);
create index organization_invitations_token_idx on public.organization_invitations(token_hash,status,expires_at);
create table public.user_role_assignments(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,
 role_id text not null references public.roles(id),organization_id uuid references public.organizations(id) on delete cascade,
 status text not null default 'active' check(status in('active','suspended','revoked')),created_by uuid references public.profiles(id),
 created_at timestamptz not null default now(),unique nulls not distinct(user_id,role_id,organization_id)
);
create table public.verification_cases(
 id uuid primary key default gen_random_uuid(),subject_type text not null check(subject_type in('freelancer','organization')),
 subject_id uuid not null,case_type text not null,status text not null default 'draft'
 check(status in('draft','submitted','under_review','changes_requested','approved','rejected')),
 notes text,review_reason text,submitted_by uuid not null references public.profiles(id),
 reviewed_by uuid references public.profiles(id),created_at timestamptz not null default now(),
 submitted_at timestamptz not null default now(),reviewed_at timestamptz
);
create index verification_cases_subject_idx on public.verification_cases(subject_type,subject_id,status);
create index verification_cases_review_idx on public.verification_cases(status,created_at);
create table public.verification_documents(
 id uuid primary key default gen_random_uuid(),case_id uuid not null references public.verification_cases(id) on delete cascade,
 storage_path text not null unique,original_filename text not null,
 mime_type text not null check(mime_type in('application/pdf','image/jpeg','image/png')),
 size_bytes bigint not null check(size_bytes between 1 and 10485760),
 uploaded_by uuid not null references public.profiles(id),created_at timestamptz not null default now()
);
create table public.audit_events(
 id bigint generated always as identity primary key,actor_user_id uuid references public.profiles(id),
 action text not null,target_type text not null,target_id uuid,metadata jsonb not null default '{}'::jsonb,
 request_id text,created_at timestamptz not null default now()
);
create index audit_events_target_idx on public.audit_events(target_type,target_id,created_at desc);
create index audit_events_actor_idx on public.audit_events(actor_user_id,created_at desc);
insert into public.roles values
('guest','persona','Guest',false),('freelancer_contributor','persona','Freelancer Contributor',false),('freelancer_annotator','persona','Freelancer Annotator',false),
('freelancer_qa_specialist','persona','Freelancer QA Specialist',false),('vendor_owner','organization','Vendor Owner',false),
('vendor_admin','organization','Vendor Admin',false),('vendor_project_manager','organization','Vendor Project Manager',false),
('enterprise_owner','organization','Enterprise Owner',false),('enterprise_member','organization','Enterprise Member',false),
('platform_sales_partnership','platform','Platform Sales/Partnership',true),('platform_project_manager','platform','Platform Project Manager',true),
('data_operations','platform','Data Operations',true),('qa_reviewer','platform','QA Reviewer',true),
('finance_operator','platform','Finance Operator',true),('trust_safety','platform','Trust & Safety',true),
('compliance_officer','platform','Compliance Officer',true),('super_admin','platform','Super Admin',true);
insert into public.permissions values
('profile.read','Read own profile'),('profile.write','Update own profile'),('organization.read','Read organization'),
('organization.manage','Manage organization profile'),('organization.members.read','Read organization members'),
('organization.members.invite','Invite organization members'),('organization.members.manage','Manage organization memberships'),
('verification.submit','Submit verification'),('verification.read','Read verification status'),('verification.review','Review verification cases'),
('platform.identity.manage','Manage platform identity'),('platform.audit.read','Read platform audit trail');
insert into public.role_permissions select 'super_admin',id from public.permissions;
insert into public.role_permissions values
('freelancer_contributor','profile.read'),('freelancer_contributor','profile.write'),('freelancer_contributor','verification.submit'),('freelancer_contributor','verification.read'),
('freelancer_annotator','profile.read'),('freelancer_annotator','profile.write'),('freelancer_annotator','verification.submit'),('freelancer_annotator','verification.read'),
('freelancer_qa_specialist','profile.read'),('freelancer_qa_specialist','profile.write'),('freelancer_qa_specialist','verification.submit'),('freelancer_qa_specialist','verification.read'),
('vendor_owner','profile.read'),('vendor_owner','profile.write'),('vendor_owner','organization.read'),('vendor_owner','organization.manage'),('vendor_owner','organization.members.read'),('vendor_owner','organization.members.invite'),('vendor_owner','organization.members.manage'),('vendor_owner','verification.submit'),('vendor_owner','verification.read'),
('vendor_admin','organization.read'),('vendor_admin','organization.manage'),('vendor_admin','organization.members.read'),('vendor_admin','organization.members.invite'),('vendor_admin','organization.members.manage'),
('vendor_project_manager','organization.read'),('vendor_project_manager','organization.members.read'),
('enterprise_owner','profile.read'),('enterprise_owner','profile.write'),('enterprise_owner','organization.read'),('enterprise_owner','organization.manage'),('enterprise_owner','organization.members.read'),('enterprise_owner','organization.members.invite'),('enterprise_owner','organization.members.manage'),('enterprise_owner','verification.submit'),('enterprise_owner','verification.read'),
('enterprise_member','organization.read'),('enterprise_member','organization.members.read'),
('platform_sales_partnership','organization.read'),('platform_sales_partnership','verification.read'),('platform_project_manager','verification.read'),('data_operations','verification.read'),('qa_reviewer','verification.read'),('qa_reviewer','verification.review'),('trust_safety','verification.read'),('trust_safety','verification.review'),
('compliance_officer','verification.read'),('compliance_officer','verification.review'),('finance_operator','platform.audit.read');
create or replace function public.has_permission(p_permission text,p_organization_id uuid default null)
returns boolean language sql stable security definer set search_path=pg_catalog,public,auth as $$
select exists(select 1 from public.profiles p where p.id=auth.uid() and p.status='active') and (
 exists(select 1 from public.user_role_assignments u join public.role_permissions rp on rp.role_id=u.role_id
 where u.user_id=auth.uid() and u.organization_id is null and u.status='active' and rp.permission_id=p_permission)
 or (p_organization_id is not null and exists(select 1 from public.organization_members m
 join public.role_permissions rp on rp.role_id=m.role_id where m.user_id=auth.uid()
 and m.organization_id=p_organization_id and m.status='active' and rp.permission_id=p_permission)));
$$;
create or replace function public.is_active_org_member(p_organization_id uuid)
returns boolean language sql stable security definer set search_path=pg_catalog,public,auth as $$
select exists(select 1 from public.organization_members m join public.profiles p on p.id=m.user_id
where m.organization_id=p_organization_id and m.user_id=auth.uid() and m.status='active' and p.status='active');
$$;
create or replace function public.is_org_creator(p_organization_id uuid)
returns boolean language sql stable security definer set search_path=pg_catalog,public,auth as $
 select exists(select 1 from public.organizations where id=p_organization_id and created_by=auth.uid());
$;
create or replace function public.accept_org_invitation(p_token_hash text)
returns uuid language plpgsql security definer set search_path=pg_catalog,public,auth as $
declare v_inv public.organization_invitations%rowtype; v_uid uuid:=auth.uid(); v_email text:=lower(coalesce(auth.jwt()->>'email',''));
begin
 if v_uid is null or v_email='' then raise exception 'authentication required' using errcode='28000'; end if;
 select * into v_inv from public.organization_invitations where token_hash=p_token_hash for update;
 if not found or v_inv.status<>'pending' or v_inv.expires_at<=now() then raise exception 'invitation invalid or expired' using errcode='22023'; end if;
 if lower(v_inv.email)<>v_email then raise exception 'invitation email mismatch' using errcode='42501'; end if;
 if not exists(select 1 from public.organizations o where o.id=v_inv.organization_id
   and ((o.kind='vendor' and v_inv.role_id in('vendor_admin','vendor_project_manager'))
     or (o.kind='enterprise' and v_inv.role_id='enterprise_member'))) then
   raise exception 'invitation role does not match organization' using errcode='22023';
 end if;
 insert into public.organization_members(organization_id,user_id,role_id,status,created_by)
 values(v_inv.organization_id,v_uid,v_inv.role_id,'active',v_inv.invited_by)
 on conflict(organization_id,user_id) do update set role_id=excluded.role_id,status='active',updated_at=now();
 update public.organization_invitations set status='accepted',accepted_by=v_uid,responded_at=now() where id=v_inv.id;
 insert into public.audit_events(actor_user_id,action,target_type,target_id)
 values(v_uid,'organization.invitation_accepted','invitation',v_inv.id);
 return v_inv.organization_id;
end; $;
create or replace function public.mutate_org_invitation(p_org_id uuid,p_invitation_id uuid,p_action text,p_new_hash text default null)
returns boolean language plpgsql security definer set search_path=pg_catalog,public,auth as $
begin
 if not public.has_permission('organization.members.invite',p_org_id) then raise exception 'permission denied' using errcode='42501'; end if;
 if p_action='revoke' then
   update public.organization_invitations set status='revoked',responded_at=now()
   where id=p_invitation_id and organization_id=p_org_id and status='pending';
 elsif p_action='resend' and p_new_hash is not null and length(p_new_hash)=64 then
   update public.organization_invitations set token_hash=p_new_hash,status='pending',
     expires_at=now()+interval '7 days',responded_at=null
   where id=p_invitation_id and organization_id=p_org_id and status in('pending','expired');
 else raise exception 'invalid invitation action' using errcode='22023';
 end if;
 return found;
end; $;
create or replace function public.review_verification_case(p_case_id uuid,p_status text,p_reason text)
returns table(id uuid,status text,review_reason text,reviewed_at timestamptz) language plpgsql security definer set search_path=pg_catalog,public,auth as $
declare v_case public.verification_cases%rowtype;
begin
 if auth.jwt()->>'aal' <> 'aal2' then raise exception 'MFA AAL2 required' using errcode='42501'; end if;
 if not public.has_permission('verification.review',null) then raise exception 'permission denied' using errcode='42501'; end if;
 if p_status not in('under_review','changes_requested','approved','rejected') then raise exception 'invalid decision' using errcode='22023'; end if;
 update public.verification_cases set status=p_status,review_reason=p_reason,reviewed_by=auth.uid(),reviewed_at=now()
 where id=p_case_id and status in('submitted','under_review','changes_requested') returning * into v_case;
 if not found then raise exception 'reviewable case not found' using errcode='P0002'; end if;
 if v_case.subject_type='organization' and p_status='approved' then
   update public.organizations set verification_status='approved',verified_at=now(),updated_at=now() where id=v_case.subject_id;
 elsif v_case.subject_type='organization' and p_status in('changes_requested','rejected') then
   update public.organizations set verification_status=p_status,updated_at=now() where id=v_case.subject_id;
 end if;
 insert into public.audit_events(actor_user_id,action,target_type,target_id,metadata)
 values(auth.uid(),'verification.decision','verification_case',v_case.id,jsonb_build_object('status',p_status,'reason',p_reason));
 return query select v_case.id,v_case.status,v_case.review_reason,v_case.reviewed_at;
end; $;
create or replace function public.reject_org_invitation(p_token_hash text)
returns boolean language plpgsql security definer set search_path=pg_catalog,public,auth as $
declare v_inv public.organization_invitations%rowtype; v_uid uuid:=auth.uid(); v_email text:=lower(coalesce(auth.jwt()->>'email',''));
begin
 select * into v_inv from public.organization_invitations where token_hash=p_token_hash for update;
 if not found or v_inv.status<>'pending' or v_inv.expires_at<=now() then raise exception 'invitation invalid or expired' using errcode='22023'; end if;
 if v_uid is null or lower(v_inv.email)<>v_email then raise exception 'invitation email mismatch' using errcode='42501'; end if;
 update public.organization_invitations set status='rejected',responded_at=now() where id=v_inv.id;
 insert into public.audit_events(actor_user_id,action,target_type,target_id)
 values(v_uid,'organization.invitation_rejected','invitation',v_inv.id);
 return true;
end; $;
create or replace function public.provision_platform_role(p_user_id uuid,p_role_id text,p_reason text)
returns void language plpgsql security definer set search_path=pg_catalog,public,auth as $
begin
 if coalesce(auth.role(),'')<>'service_role' then raise exception 'service role provisioning required' using errcode='42501'; end if;
 if not exists(select 1 from public.roles where id=p_role_id and scope='platform') then raise exception 'invalid platform role' using errcode='22023'; end if;
 insert into public.user_role_assignments(user_id,role_id,status,created_by)
 values(p_user_id,p_role_id,'active',null)
 on conflict(user_id,role_id,organization_id) do update set status='active';
 insert into public.audit_events(actor_user_id,action,target_type,target_id,metadata)
 values(null,'platform.role_provisioned','profile',p_user_id,jsonb_build_object('role_id',p_role_id,'reason',p_reason));
end; $;
create or replace function public.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 insert into public.profiles(id,display_name) values(new.id,nullif(new.raw_user_meta_data->>'full_name','')) on conflict(id) do nothing;
 insert into public.user_preferences(user_id) values(new.id) on conflict(user_id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute function public.create_profile_for_auth_user();
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.user_role_assignments enable row level security;
alter table public.verification_cases enable row level security;
alter table public.verification_documents enable row level security;
alter table public.audit_events enable row level security;
create policy profiles_select_self on public.profiles for select to authenticated using(id=auth.uid() or exists(select 1 from public.organization_members m where m.user_id=profiles.id and m.status='active' and public.has_permission('organization.members.read',m.organization_id)));
create policy profiles_update_self on public.profiles for update to authenticated using(id=auth.uid() and status='active') with check(id=auth.uid() and status='active');
create policy preferences_self on public.user_preferences for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and (active_organization_id is null or public.is_active_org_member(active_organization_id)));
create policy roles_read on public.roles for select to authenticated using(true);
create policy permissions_read on public.permissions for select to authenticated using(true);
create policy role_permissions_read on public.role_permissions for select to authenticated using(true);
create policy organizations_read_member on public.organizations for select to authenticated using(public.is_active_org_member(id));
create policy organizations_create_self on public.organizations for insert to authenticated with check(created_by=auth.uid() and verification_status='submitted' and catalog_publishing_enabled=false);
create policy organizations_update_manager on public.organizations for update to authenticated using(public.has_permission('organization.manage',id)) with check(public.has_permission('organization.manage',id) and catalog_publishing_enabled=false);
create policy members_read on public.organization_members for select to authenticated using(user_id=auth.uid() or public.has_permission('organization.members.read',organization_id));
create policy members_create_owner on public.organization_members for insert to authenticated with check(user_id=auth.uid() and created_by=auth.uid() and status='active' and role_id in('vendor_owner','enterprise_owner') and public.is_org_creator(organization_id) and exists(select 1 from public.organizations o where o.id=organization_id and ((o.kind='vendor' and role_id='vendor_owner') or (o.kind='enterprise' and role_id='enterprise_owner'))));
create policy members_manage on public.organization_members for update to authenticated using(public.has_permission('organization.members.manage',organization_id) and role_id not in('vendor_owner','enterprise_owner')) with check(public.has_permission('organization.members.manage',organization_id) and role_id not in('vendor_owner','enterprise_owner'));
create policy invitations_read on public.organization_invitations for select to authenticated using(public.has_permission('organization.members.read',organization_id) or lower(email)=lower(coalesce(auth.jwt()->>'email','')));
create policy invitations_create on public.organization_invitations for insert to authenticated with check(public.has_permission('organization.members.invite',organization_id) and invited_by=auth.uid() and status='pending' and exists(select 1 from public.organizations o where o.id=organization_id and ((o.kind='vendor' and role_id in('vendor_admin','vendor_project_manager')) or (o.kind='enterprise' and role_id='enterprise_member'))));
-- Invitation status transitions are restricted to SECURITY DEFINER RPCs below.
create policy role_assignments_read_self on public.user_role_assignments for select to authenticated using(user_id=auth.uid());
create policy role_assignments_freelancer_self on public.user_role_assignments for insert to authenticated with check(user_id=auth.uid() and created_by=auth.uid() and organization_id is null and role_id in('freelancer_contributor','freelancer_annotator','freelancer_qa_specialist'));
create policy verification_read on public.verification_cases for select to authenticated using(submitted_by=auth.uid() or (subject_type='freelancer' and subject_id=auth.uid()) or (subject_type='organization' and public.is_active_org_member(subject_id)) or public.has_permission('verification.review',null));
create policy verification_submit on public.verification_cases for insert to authenticated with check(submitted_by=auth.uid() and status='submitted' and ((subject_type='freelancer' and subject_id=auth.uid()) or (subject_type='organization' and public.has_permission('verification.submit',subject_id))));
create policy verification_review on public.verification_cases for update to authenticated using(public.has_permission('verification.review',null)) with check(public.has_permission('verification.review',null));
create policy verification_docs_read on public.verification_documents for select to authenticated using(uploaded_by=auth.uid() or exists(select 1 from public.verification_cases c where c.id=case_id and public.has_permission('verification.review',null)));
create policy verification_docs_create on public.verification_documents for insert to authenticated with check(uploaded_by=auth.uid() and exists(select 1 from public.verification_cases c where c.id=case_id and c.submitted_by=auth.uid() and c.status in('draft','submitted')));
create policy audit_read on public.audit_events for select to authenticated using(public.has_permission('platform.audit.read',null));
create policy audit_insert on public.audit_events for insert to authenticated with check(actor_user_id=auth.uid());
revoke all on all tables in schema public from anon;
grant select,insert on public.profiles to authenticated;
grant update(display_name,phone,country_code,city,bio) on public.profiles to authenticated;
grant select,insert,update(locale,timezone,active_organization_id) on public.user_preferences to authenticated;
grant select,insert on public.organizations to authenticated;
grant update(legal_name,trading_name,website,business_email,address,industry,contact_person,authorized_representative,business_purpose,updated_at) on public.organizations to authenticated;
grant select,insert on public.organization_members to authenticated;
grant update(status,updated_at) on public.organization_members to authenticated;
grant select,insert on public.organization_invitations to authenticated;
grant select,insert on public.user_role_assignments to authenticated;
grant select,insert on public.verification_cases to authenticated;
grant update(status,review_reason,reviewed_by,reviewed_at) on public.verification_cases to authenticated;
grant select,insert on public.verification_documents to authenticated;
grant select,insert on public.audit_events to authenticated;
grant select on public.roles,public.permissions,public.role_permissions to authenticated;
grant usage,select on sequence public.audit_events_id_seq to authenticated;
grant execute on function public.has_permission(text,uuid),public.is_active_org_member(uuid),public.is_org_creator(uuid),public.accept_org_invitation(text),public.reject_org_invitation(text),public.mutate_org_invitation(uuid,uuid,text,text),public.review_verification_case(uuid,text,text) to authenticated;
revoke execute on function public.provision_platform_role(uuid,text,text) from public,anon,authenticated;
grant execute on function public.provision_platform_role(uuid,text,text) to service_role;
revoke execute on function public.rls_auto_enable() from public,anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('verification-private','verification-private',false,10485760,array['application/pdf','image/jpeg','image/png']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy verification_storage_insert on storage.objects for insert to authenticated
with check(bucket_id='verification-private' and (storage.foldername(name))[1]=auth.uid()::text);
create policy verification_storage_read on storage.objects for select to authenticated
using(bucket_id='verification-private' and ((storage.foldername(name))[1]=auth.uid()::text or public.has_permission('verification.review',null)));
commit;
