alter table public.plans enable row level security;
alter table public.participants enable row level security;
alter table public.availability enable row level security;
alter table public.join_codes enable row level security;

create policy "plan owners can read their plans"
on public.plans
for select
to authenticated
using (auth.uid() = owner_user_id);

create policy "plan owners can create plans"
on public.plans
for insert
to authenticated
with check (auth.uid() = owner_user_id);

create policy "plan owners can update their plans"
on public.plans
for update
to authenticated
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

create policy "plan owners can delete their plans"
on public.plans
for delete
to authenticated
using (auth.uid() = owner_user_id);