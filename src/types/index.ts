export type ListingCondition = 'edible' | 'spoiled';
export type ListingStatus = 'available' | 'claimed';
export type QuantityUnit = 'kg' | 'portions';
export type DonorType = 'restaurant' | 'caterer' | 'grocery_store' | 'vegetable_market';
export type ClaimerType = 'ngo' | 'farm';

export interface Listing {
  id: string;
  donor_name: string;
  donor_type: DonorType;
  waste_type: string;
  condition: ListingCondition;
  quantity: number;
  quantity_unit: QuantityUnit;
  pickup_address: string;
  status: ListingStatus;
  claimed_by: string | null;
  claimer_type: ClaimerType | null;
  notes: string | null;
  created_at: string;
  claimed_at: string | null;
}

export type UserRole = 'donor' | 'ngo' | 'farm';

export interface NewListing {
  donor_name: string;
  donor_type: DonorType;
  waste_type: string;
  condition: ListingCondition;
  quantity: number;
  quantity_unit: QuantityUnit;
  pickup_address: string;
  notes: string | null;
}
