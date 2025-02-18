/*
  # Initial Schema Setup for Home Wishlist App

  1. Tables Created
    - `wishlist`: Stores wishlist information with customization options
      - `id` (uuid, primary key)
      - `name` (text)
      - `icon` (text, optional)
      - `color` (text, optional)
      - `created_at` (timestamp)
    
    - `product`: Stores product information
      - `id` (uuid, primary key)
      - `name` (text)
      - `priority` (text, enum: low/medium/high)
      - `created_at` (timestamp)
    
    - `wishlist_products`: Junction table linking wishlists and products
      - `id` (uuid, primary key)
      - `wishlist_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `checked` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wishlist_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID REFERENCES wishlist(id) ON DELETE CASCADE,
  product_id UUID REFERENCES product(id) ON DELETE CASCADE,
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(wishlist_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all access for authenticated users" ON wishlist
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON product
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON wishlist_products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);