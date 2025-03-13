/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `seller_id` (uuid) - References profiles.id
      - `invoice_number` (text, unique)
      - `invoice_date` (date)
      - `customer_gstin` (text)
      - `total_amount` (numeric)
      - `gst_amount` (numeric)
      - `irn` (text)
      - `status` (text)
      - `reconciliation_status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `invoices` table
    - Add policy for sellers to CRUD their own invoices
    - Add policy for customers to read invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id),
  invoice_number text UNIQUE NOT NULL,
  invoice_date date NOT NULL,
  customer_gstin text NOT NULL,
  total_amount numeric NOT NULL,
  gst_amount numeric NOT NULL,
  irn text,
  status text NOT NULL DEFAULT 'pending',
  reconciliation_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can CRUD own invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Customers can read invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'customer'
    )
  );