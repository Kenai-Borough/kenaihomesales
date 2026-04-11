create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('buyer', 'seller', 'admin')) default 'buyer',
  full_name text,
  phone text,
  company_name text,
  bio text,
  avatar_url text,
  city text,
  state text default 'AK',
  email text,
  verified boolean default false,
  verification_notes text,
  last_active_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.homes (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  slug text unique not null,
  title text not null,
  status text not null check (status in ('draft', 'active', 'pending', 'sold', 'archived')) default 'draft',
  property_type text not null check (property_type in ('single_family', 'cabin', 'manufactured', 'multi_family', 'townhouse')),
  list_price numeric(12,2) not null,
  street_address text not null,
  address_line_2 text,
  city text not null,
  state text not null default 'AK',
  postal_code text not null,
  borough text default 'Kenai Peninsula Borough',
  latitude numeric(10,6),
  longitude numeric(10,6),
  neighborhood text,
  subdivision text,
  bedrooms integer default 0,
  bathrooms numeric(4,1) default 0,
  square_feet integer,
  lot_size numeric(8,2),
  year_built integer,
  stories integer,
  garage_spaces integer,
  parking_spaces integer,
  hoa_fee numeric(10,2) default 0,
  annual_taxes numeric(10,2) default 0,
  heating text,
  cooling text,
  sewer text,
  water text,
  view_description text,
  school_district text,
  zoning text,
  occupancy text,
  furnishing_status text,
  virtual_tour_url text,
  video_url text,
  hero_image_url text,
  gallery jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  seller_notes text,
  showing_instructions text,
  verification_status text default 'pending',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.saved_homes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  home_id uuid not null references public.homes(id) on delete cascade,
  created_at timestamptz default now(),
  unique (profile_id, home_id)
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}'::jsonb,
  email_alerts boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  home_id uuid not null references public.homes(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  preferred_contact_method text default 'email',
  status text not null check (status in ('new', 'responded', 'scheduled', 'closed')) default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.home_views (
  id uuid primary key default gen_random_uuid(),
  home_id uuid not null references public.homes(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  viewed_at timestamptz default now(),
  session_id text,
  referrer text
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  home_id uuid references public.homes(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists homes_city_idx on public.homes(city);
create index if not exists homes_price_idx on public.homes(list_price);
create index if not exists homes_type_idx on public.homes(property_type);
create index if not exists homes_seller_idx on public.homes(seller_id);
create index if not exists saved_homes_profile_idx on public.saved_homes(profile_id);
create index if not exists inquiries_seller_idx on public.inquiries(seller_id);
create index if not exists inquiries_home_idx on public.inquiries(home_id);
create index if not exists home_views_home_idx on public.home_views(home_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
drop trigger if exists set_homes_updated_at on public.homes;
create trigger set_homes_updated_at before update on public.homes for each row execute procedure public.handle_updated_at();
drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at before update on public.inquiries for each row execute procedure public.handle_updated_at();
drop trigger if exists set_saved_searches_updated_at on public.saved_searches;
create trigger set_saved_searches_updated_at before update on public.saved_searches for each row execute procedure public.handle_updated_at();
drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at before update on public.reviews for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.homes enable row level security;
alter table public.saved_homes enable row level security;
alter table public.saved_searches enable row level security;
alter table public.inquiries enable row level security;
alter table public.home_views enable row level security;
alter table public.reviews enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "users manage own profile"
  on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "homes are viewable by everyone"
  on public.homes for select using (true);
create policy "sellers manage own homes"
  on public.homes for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy "users manage saved homes"
  on public.saved_homes for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "users manage saved searches"
  on public.saved_searches for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "buyers and sellers view relevant inquiries"
  on public.inquiries for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "buyers create inquiries"
  on public.inquiries for insert with check (auth.uid() = buyer_id or buyer_id is null);
create policy "sellers update inquiries"
  on public.inquiries for update using (auth.uid() = seller_id);

create policy "home views insertable by everyone"
  on public.home_views for insert with check (true);
create policy "sellers view home views"
  on public.home_views for select using (
    exists (
      select 1 from public.homes h where h.id = home_id and h.seller_id = auth.uid()
    )
  );

create policy "reviews readable by everyone"
  on public.reviews for select using (true);
create policy "users manage own reviews"
  on public.reviews for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
