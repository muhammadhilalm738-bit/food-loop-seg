import { useState } from 'react';
import { Wheat, MapPin, Clock, Check, Loader2, Zap, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/types';

interface FarmFeedProps {
  listings: Listing[];
  loading: boolean;
  onClaim: () => void;
}

export default function FarmFeed({ listings, loading, onClaim }: FarmFeedProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimerName, setClaimerName] = useState('');
  const [showNameInput, setShowNameInput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async (listing: Listing) => {
    if (!claimerName.trim()) {
      setError('Please enter your farm or plant name.');
      return;
    }

    setClaimingId(listing.id);
    setError(null);

    const { error: updateError } = await supabase
      .from('listings')
      .update({
        status: 'claimed',
        claimed_by: claimerName.trim(),
        claimer_type: 'farm',
        claimed_at: new Date().toISOString(),
      })
      .eq('id', listing.id);

    setClaimingId(null);

    if (updateError) {
      setError('Failed to claim listing. Please try again.');
      return;
    }

    setShowNameInput(null);
    setClaimerName('');
    onClaim();
  };

  const availableListings = listings.filter((l) => l.status === 'available');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-earth-500 flex items-center justify-center">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Farm & Energy Feed</h1>
            <p className="text-stone-600 text-sm">Spoiled food & scraps for feed and fuel</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-100 text-earth-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-earth-500 animate-pulse-soft" />
          {availableListings.length} available
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-earth-500" />
        </div>
      ) : availableListings.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="font-semibold text-stone-700 mb-1">No scraps available</h3>
          <p className="text-sm text-stone-500">
            New spoiled food and scrap listings will appear here as donors post them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableListings.map((listing) => (
            <div key={listing.id} className="card p-5 border-earth-200 hover:border-earth-400 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-earth-100 text-earth-700 text-xs font-semibold">
                      <Wheat className="w-3 h-3" />
                      Scraps
                    </span>
                    <span className="text-xs text-stone-400">
                      {listing.donor_type === 'restaurant' ? 'Restaurant' :
                       listing.donor_type === 'caterer' ? 'Event Caterer' :
                       listing.donor_type === 'grocery_store' ? 'Grocery Store' : 'Vegetable Market'}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg leading-snug">{listing.waste_type}</h3>
                  <p className="text-sm text-stone-500">by {listing.donor_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-extrabold text-earth-600">
                    {listing.quantity}
                  </p>
                  <p className="text-xs text-stone-400 uppercase tracking-wide">
                    {listing.quantity_unit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-start gap-2 text-stone-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-stone-400 flex-shrink-0" />
                  <span className="line-clamp-2">{listing.pickup_address}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <Clock className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span>{formatTimeAgo(listing.created_at)}</span>
                </div>
              </div>

              {listing.notes && (
                <div className="mb-4 p-3 rounded-lg bg-stone-50 text-sm text-stone-600">
                  {listing.notes}
                </div>
              )}

              {showNameInput === listing.id ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={claimerName}
                    onChange={(e) => setClaimerName(e.target.value)}
                    placeholder="Your farm / biogas plant name"
                    className="input-field-earth flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => handleClaim(listing)}
                    disabled={claimingId === listing.id}
                    className="btn-primary bg-earth-600 hover:bg-earth-700 flex items-center justify-center gap-2"
                  >
                    {claimingId === listing.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    Confirm Claim
                  </button>
                  <button
                    onClick={() => {
                      setShowNameInput(null);
                      setClaimerName('');
                      setError(null);
                    }}
                    className="btn-secondary bg-stone-100 text-stone-600 hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNameInput(listing.id)}
                  className="btn-primary bg-earth-600 hover:bg-earth-700 w-full flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Claim for Feed / Fuel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
