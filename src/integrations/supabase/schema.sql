-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) not null,
  tutor_id uuid references public.profiles(id) not null,
  subject text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  note text,
  room_url text,
  calendar_event text,
  email_reminder boolean,
  session_summary text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table public.bookings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own bookings" on public.bookings;
drop policy if exists "Users can insert their own bookings" on public.bookings;
drop policy if exists "Users can update their own bookings" on public.bookings;

-- Create new policies
create policy "Users can view their own bookings"
  on public.bookings for select
  using (
    auth.uid() = student_id or 
    auth.uid() = tutor_id
  );

create policy "Users can insert their own bookings"
  on public.bookings for insert
  with check (
    auth.uid() = student_id
  );

create policy "Users can update their own bookings"
  on public.bookings for update
  using (
    auth.uid() = student_id or 
    auth.uid() = tutor_id
  );

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
  before update on public.bookings
  for each row
  execute procedure public.handle_updated_at();

-- Ensure profiles table has proper RLS policies
alter table public.profiles enable row level security;

-- Drop existing profile policies if they exist
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can view other profiles" on public.profiles;

-- Create new profile policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (
    auth.uid() = id
  );

create policy "Users can view other profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.bookings
      where (bookings.student_id = profiles.id or bookings.tutor_id = profiles.id)
      and (bookings.student_id = auth.uid() or bookings.tutor_id = auth.uid())
    )
  ); 