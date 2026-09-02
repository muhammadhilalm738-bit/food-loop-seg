/*
# Create listings table for Food Waste Redistribution Platform

1. Purpose
   This table stores surplus food listings posted by donors (restaurants, caterers,
   grocery stores, vegetable markets). Each listing is marked as either safe for
   human consumption (edible) or spoiled/scraps (for farms/biogas). NGOs and
   farmers can claim listings. The app has no sign-in screen, so all policies
   are scoped to anon + authenticated (single-tenant, shared/public data).

2. New Tables
   - `listings`
     - `id` (uuid, primary key)
     - `donor_name` (text, name of the donor organization or individual)
     - `donor_type` (text, type of donor: restaurant, caterer, grocery_store, vegetable_market)
     - `waste_type` (text, description of the food waste, e.g. "Cooked rice", "Vegetable peels")
     - `condition` (text, either 'edible' or 'spoiled' — the crucial toggle)
     - `quantity` (numeric, amount of food waste)
     - `quantity_unit` (text, either 'kg' or 'portions')
     - `pickup_address` (text, where the food can be picked up)
     - `status` (text, 'available' or 'claimed', defaults to 'available')
     - `claimed_by` (text, nullable, name of the NGO/farm that claimed it)
     - `claimer_type` (text, nullable, 'ngo' or 'farm')
     - `notes` (text, nullable, any additional notes from the donor)
     - `created_at` (timestamptz, defaults to now)
     - `claimed_at` (timestamptz, nullable, when the listing was claimed)

3. Security
   - Enable RLS on `listings`.
   - Allow anon + authenticated full CRUD because the data is intentionally
     public/shared (single-tenant app with no sign-in screen).
   - All four policies (select, insert, update, delete) use TO anon, authenticated.

4. Important Notes
   - This is a single-tenant app with no authentication. All data is shared and
     publicly visible. The anon-key frontend needs full CRUD access.
   - The `condition` column drives which feed the listing appears in:
     'edible' → NGO Feed, 'spoiled' → Farm & Energy Feed.
   - The `status` column tracks whether a listing is still available or claimed.
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_type text NOT NULL DEFAULT 'restaurant',
  waste_type text NOT NULL,
  condition text NOT NULL DEFAULT 'edible',
  quantity numeric NOT NULL DEFAULT 0,
  quantity_unit text NOT NULL DEFAULT 'kg',
  pickup_address text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  claimed_by text,
  claimer_type text,
  notes text,
  created_at timestamptz DEFAULT now(),
  claimed_at timestamptz
);

-- Add a check constraint for condition
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_condition_check;
ALTER TABLE listings ADD CONSTRAINT listings_condition_check
  CHECK (condition IN ('edible', 'spoiled'));

-- Add a check constraint for status
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_status_check
  CHECK (status IN ('available', 'claimed'));

-- Add a check constraint for claimer_type (nullable)
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_claimer_type_check;
ALTER TABLE listings ADD CONSTRAINT listings_claimer_type_check
  CHECK (claimer_type IS NULL OR claimer_type IN ('ngo', 'farm'));

-- Add a check constraint for quantity_unit
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_quantity_unit_check;
ALTER TABLE listings ADD CONSTRAINT listings_quantity_unit_check
  CHECK (quantity_unit IN ('kg', 'portions'));

-- Add a check constraint for donor_type
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_donor_type_check;
ALTER TABLE listings ADD CONSTRAINT listings_donor_type_check
  CHECK (donor_type IN ('restaurant', 'caterer', 'grocery_store', 'vegetable_market'));

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "anon_select_listings" ON listings;
DROP POLICY IF EXISTS "anon_insert_listings" ON listings;
DROP POLICY IF EXISTS "anon_update_listings" ON listings;
DROP POLICY IF EXISTS "anon_delete_listings" ON listings;

-- Create policies: anon + authenticated can do everything (single-tenant, shared data)
CREATE POLICY "anon_select_listings"
ON listings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_insert_listings"
ON listings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "anon_update_listings"
ON listings FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_listings"
ON listings FOR DELETE
TO anon, authenticated
USING (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings (condition);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings (created_at DESC);
