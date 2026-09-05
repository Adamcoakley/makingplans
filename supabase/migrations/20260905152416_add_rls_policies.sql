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

create policy "users can read their own participant records"
on public.participants
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can create their own participant records"
on public.participants
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update their own participant records"
on public.participants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete their own participant records"
on public.participants
for delete
to authenticated
using (auth.uid() = user_id);

create policy "users can read their own availability"
on public.availability
for select
to authenticated
using (
  exists (
    select 1
    from public.participants
    where participants.id = availability.participant_id
      and participants.user_id = auth.uid()
  )
);

create policy "users can create their own availability"
on public.availability
for insert
to authenticated
with check (
  exists (
    select 1
    from public.participants
    where participants.id = availability.participant_id
      and participants.user_id = auth.uid()
  )
);

create policy "users can update their own availability"
on public.availability
for update
to authenticated
using (
  exists (
    select 1
    from public.participants
    where participants.id = availability.participant_id
      and participants.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.participants
    where participants.id = availability.participant_id
      and participants.user_id = auth.uid()
  )
);

create policy "users can delete their own availability"
on public.availability
for delete
to authenticated
using (
  exists (
    select 1
    from public.participants
    where participants.id = availability.participant_id
      and participants.user_id = auth.uid()
  )
);

create policy "plan owners can read their join codes"
on public.join_codes
for select
to authenticated
using (
  exists (
    select 1
    from public.plans
    where plans.id = join_codes.plan_id
      and plans.owner_user_id = auth.uid()
  )
);

create policy "plan owners can create join codes"
on public.join_codes
for insert
to authenticated
with check (
  exists (
    select 1
    from public.plans
    where plans.id = join_codes.plan_id
      and plans.owner_user_id = auth.uid()
  )
);

create policy "plan owners can update their join codes"
on public.join_codes
for update
to authenticated
using (
  exists (
    select 1
    from public.plans
    where plans.id = join_codes.plan_id
      and plans.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.plans
    where plans.id = join_codes.plan_id
      and plans.owner_user_id = auth.uid()
  )
);

create policy "plan owners can delete their join codes"
on public.join_codes
for delete
to authenticated
using (
  exists (
    select 1
    from public.plans
    where plans.id = join_codes.plan_id
      and plans.owner_user_id = auth.uid()
  )
);