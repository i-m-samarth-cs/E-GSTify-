/*
  # Add seller details to profiles table

  1. Changes
    - Add GSTIN column to profiles table
    - Add company_name column to profiles table
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS gstin text,
ADD COLUMN IF NOT EXISTS company_name text;