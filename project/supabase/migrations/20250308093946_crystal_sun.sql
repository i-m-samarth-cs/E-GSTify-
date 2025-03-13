/*
  # Initial schema setup for user profiles

  1. New Tables
    - `profiles` table for storing user information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `role` (text, either 'seller' or 'customer')
      - `gstin` (text, optional)
      - `company_name` (text, optional)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS
    - Add policies for:
      - Insert: Allow authenticated users to create their own profile
      - Select: Allow users to read their own profile
      - Update: Allow users to update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('seller', 'customer')),
  gstin text,
  company_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can create their own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;