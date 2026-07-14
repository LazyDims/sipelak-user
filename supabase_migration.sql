-- Migration file for Supabase
-- Run this in your Supabase project's SQL Editor

-- 1. Create a table for user profiles linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nik varchar(16) unique,
  nama_lengkap text not null,
  phone varchar(20),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Allow public read-access for profiles"
  on public.profiles for select
  using (true);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow users to insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. Create a table for submissions (pengajuan)
create table public.pengajuan (
  id uuid default gen_random_uuid() primary key,
  code varchar(20) unique not null,
  user_id uuid references auth.users on delete cascade not null,
  nik varchar(16) not null,
  nama text not null,
  service_type varchar(50) not null,
  service_title text not null,
  phone varchar(20) not null,
  email text not null,
  alamat text not null,
  rt varchar(5) not null,
  rw varchar(5) not null,
  status varchar(50) default 'Verifikasi Berkas' not null,
  status_detail text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone,
  document_url text
);

-- Enable RLS on pengajuan
alter table public.pengajuan enable row level security;

-- Create policies for pengajuan
-- 1. Anyone can read a submission by its unique code (for the tracking widget on landing page)
create policy "Allow anyone to read submission by code"
  on public.pengajuan for select
  using (true);

-- 2. Users can read their own submissions
create policy "Allow users to read their own submissions"
  on public.pengajuan for select
  using (auth.uid() = user_id);

-- 3. Users can insert their own submissions
create policy "Allow users to insert their own submissions"
  on public.pengajuan for insert
  with check (auth.uid() = user_id);

-- 4. Users can update their own submissions (e.g. if they cancel, though usually handled by admin)
create policy "Allow users to update their own submissions"
  on public.pengajuan for update
  using (auth.uid() = user_id);

-- 3. Create a trigger to automatically insert a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama_lengkap, phone, nik)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'nama_lengkap', 'Warga Kecamatan'), 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'nik'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
