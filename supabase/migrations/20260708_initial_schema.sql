create table public.workouts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date  not null,
  notes text,
  workout_duration integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz  not null default now()

)

create table public.exercise(
 id bigint generated always as identity primary key,
 exercise_name text not null unique,
 targeted_muscles text not null ,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
)

create table public.set(
  id bigint generated always as identity primary key,
  workout_id bigint not null references public.workouts(id) on delete cascade,
  exercise_id bigint not null references public.exercise(id) on delete restrict,
  set_number integer not null,
  reps integer not null,
  weight numeric (5,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
  
  
)