/*
  # Create invoice items table

  1. New Tables
    - `invoice_items`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid) - References invoices.id
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `quantity` (numeric)
      - `price` (numeric)
      - `gst_rate` (numeric)
      - `gst_amount` (numeric)
      - `total_amount` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `invoice_items` table
    - Add policy for sellers to CRUD their own invoice items
    - Add policy for customers to read invoice items
*/

CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  quantity numeric NOT NULL,
  price numeric NOT NULL,
  gst_rate numeric NOT NULL,
  gst_amount numeric NOT NULL,
  total_amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can CRUD own invoice items"
  ON invoice_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE id = invoice_items.invoice_id
      AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Customers can read invoice items"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'customer'
    )
  );