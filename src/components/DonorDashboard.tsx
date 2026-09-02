import { useState } from 'react';
import { Heart, Wheat, Plus, Check, Loader2, MapPin, Package, Scale, FileText, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ListingCondition, QuantityUnit, DonorType, NewListing } from '@/types';

interface DonorDashboardProps {
  onPosted: () => void;
}

const donorTypes: { value: DonorType; label: string }[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'caterer', label: 'Event Caterer' },
  { value: 'grocery_store', label: 'Grocery Store' },
  { value: 'vegetable_market', label: 'Vegetable Market' },
];

export default function DonorDashboard({ onPosted }: DonorDashboardProps) {
  const [condition, setCondition] = useState<ListingCondition>('edible');
  const [donorName, setDonorName] = useState('');
  const [donorType, setDonorType] = useState<DonorType>('restaurant');
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState<QuantityUnit>('kg');
  const [pickupAddress, setPickupAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdible = condition === 'edible';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !wasteType || !quantity || !pickupAddress) {
      setError('Please fill in all required fields.');
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const newListing: NewListing = {
      donor_name: donorName,
      donor_type: donorType,
      waste_type: wasteType,
      condition,
      quantity: qty,
      quantity_unit: quantityUnit,
      pickup_address: pickupAddress,
      notes: notes.trim() || null,
    };

    const { error: insertError } = await supabase.from('listings').insert(newListing);

    setSubmitting(false);

    if (insertError) {
      setError('Failed to post listing. Please try again.');
      return;
    }

    setSuccess(true);
    setDonorName('');
    setWasteType('');
    setQuantity('');
    setPickupAddress('');
    setNotes('');
    onPosted();

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">Donor Dashboard</h1>
        <p className="text-stone-600">List your surplus food waste for redistribution.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-forest-50 border border-forest-200 flex items-center gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <p className="text-forest-800 font-medium text-sm">
            Listing posted successfully! Receivers can now see and claim your surplus.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-5">
        {/* Condition Toggle — the crucial field */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCondition('edible')}
              className={`flex items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                isEdible
                  ? 'border-forest-500 bg-forest-50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-forest-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isEdible ? 'bg-forest-500' : 'bg-stone-200'
              }`}>
                <Heart className={`w-5 h-5 ${isEdible ? 'text-white' : 'text-stone-400'}`} />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${isEdible ? 'text-forest-800' : 'text-stone-600'}`}>
                  Safe for Human Consumption
                </p>
                <p className={`text-xs ${isEdible ? 'text-forest-600' : 'text-stone-400'}`}>
                  Goes to NGOs
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCondition('spoiled')}
              className={`flex items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                !isEdible
                  ? 'border-earth-500 bg-earth-50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-earth-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                !isEdible ? 'bg-earth-500' : 'bg-stone-200'
              }`}>
                <Wheat className={`w-5 h-5 ${!isEdible ? 'text-white' : 'text-stone-400'}`} />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${!isEdible ? 'text-earth-800' : 'text-stone-600'}`}>
                  Spoiled / Scraps
                </p>
                <p className={`text-xs ${!isEdible ? 'text-earth-600' : 'text-stone-400'}`}>
                  For Animals & Energy
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Donor Name */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Donor Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="e.g. Green Leaf Restaurant"
              className={`${isEdible ? 'input-field' : 'input-field-earth'} pl-11`}
              required
            />
          </div>
        </div>

        {/* Donor Type */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Donor Type <span className="text-red-500">*</span>
          </label>
          <select
            value={donorType}
            onChange={(e) => setDonorType(e.target.value as DonorType)}
            className={`${isEdible ? 'input-field' : 'input-field-earth'} appearance-none cursor-pointer`}
          >
            {donorTypes.map((dt) => (
              <option key={dt.value} value={dt.value}>{dt.label}</option>
            ))}
          </select>
        </div>

        {/* Waste Type */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Waste Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              placeholder={isEdible ? "e.g. Cooked meals, fresh produce" : "e.g. Vegetable peels, expired produce"}
              className={`${isEdible ? 'input-field' : 'input-field-earth'} pl-11`}
              required
            />
          </div>
        </div>

        {/* Quantity + Unit */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Quantity <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
                className={`${isEdible ? 'input-field' : 'input-field-earth'} pl-11`}
                required
              />
            </div>
            <select
              value={quantityUnit}
              onChange={(e) => setQuantityUnit(e.target.value as QuantityUnit)}
              className={`${isEdible ? 'input-field' : 'input-field-earth'} w-32 appearance-none cursor-pointer`}
            >
              <option value="kg">Kg</option>
              <option value="portions">Portions</option>
            </select>
          </div>
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Pick-up Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <textarea
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Full address for pick-up"
              rows={2}
              className={`${isEdible ? 'input-field' : 'input-field-earth'} pl-11 resize-none`}
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Additional Notes <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 w-5 h-5 text-stone-400" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Available between 2-5 PM, please bring containers"
              rows={2}
              className={`${isEdible ? 'input-field' : 'input-field-earth'} pl-11 resize-none`}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            isEdible
              ? 'bg-forest-600 hover:bg-forest-700'
              : 'bg-earth-600 hover:bg-earth-700'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Post Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
}
