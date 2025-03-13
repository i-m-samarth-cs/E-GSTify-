/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users.id
      - `email` (text, unique)
      - `role` (text) - Either 'seller' or 'customer'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('seller', 'customer')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);