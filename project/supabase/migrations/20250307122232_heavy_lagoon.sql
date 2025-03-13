/*
  # Create profiles table and authentication schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `role` (text, either 'seller' or 'customer')
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to read their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
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