import { Loader2, Heart, Wheat, Zap, TrendingUp, Package } from 'lucide-react';
import type { Listing } from '@/types';

interface AnalyticsProps {
  listings: Listing[];
  loading: boolean;
}

export default function Analytics({ listings, loading }: AnalyticsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  const claimedListings = listings.filter((l) => l.status === 'claimed');

  // Meals served: each claimed edible portion = 1 meal, each kg of edible = ~4 meals
  const edibleClaimed = claimedListings.filter((l) => l.condition === 'edible');
  const mealsFromPortions = edibleClaimed
    .filter((l) => l.quantity_unit === 'portions')
    .reduce((sum, l) => sum + l.quantity, 0);
  const mealsFromKg = edibleClaimed
    .filter((l) => l.quantity_unit === 'kg')
    .reduce((sum, l) => sum + l.quantity * 4, 0);
  const mealsServed = Math.round(mealsFromPortions + mealsFromKg);

  // Kg of animal feed / compost redirected
  const spoiledClaimed = claimedListings.filter((l) => l.condition === 'spoiled');
  const kgFeedFromKg = spoiledClaimed
    .filter((l) => l.quantity_unit === 'kg')
    .reduce((sum, l) => sum + l.quantity, 0);
  const kgFeedFromPortions = spoiledClaimed
    .filter((l) => l.quantity_unit === 'portions')
    .reduce((sum, l) => sum + l.quantity * 0.3, 0); // estimate ~0.3 kg per portion
  const kgFeedRedirected = Math.round(kgFeedFromKg + kgFeedFromPortions);

  // CO2 saved: ~2.5 kg CO2 per kg of food waste diverted from landfill
  const totalKgDiverted =
    edibleClaimed.reduce((sum, l) => sum + (l.quantity_unit === 'kg' ? l.quantity : l.quantity * 0.3), 0) +
    spoiledClaimed.reduce((sum, l) => sum + (l.quantity_unit === 'kg' ? l.quantity : l.quantity * 0.3), 0);
  const co2Saved = Math.round(totalKgDiverted * 2.5);

  const stats = [
    {
      label: 'Meals Served',
      value: mealsServed.toLocaleString(),
      sublabel: 'Edible food distributed to people',
      icon: Heart,
      color: 'forest',
      bg: 'bg-forest-500',
      bgLight: 'bg-forest-50',
      text: 'text-forest-600',
      textDark: 'text-forest-800',
      border: 'border-forest-200',
    },
    {
      label: 'Animal Feed / Compost Redirected',
      value: `${kgFeedRedirected.toLocaleString()} kg`,
      sublabel: 'Scraps redirected to farms & biogas',
      icon: Wheat,
      color: 'earth',
      bg: 'bg-earth-500',
      bgLight: 'bg-earth-50',
      text: 'text-earth-600',
      textDark: 'text-earth-800',
      border: 'border-earth-200',
    },
    {
      label: 'Estimated CO2 Saved',
      value: `${co2Saved.toLocaleString()} kg`,
      sublabel: 'Emissions prevented from landfill',
      icon: Zap,
      color: 'forest',
      bg: 'bg-forest-400',
      bgLight: 'bg-forest-50',
      text: 'text-forest-600',
      textDark: 'text-forest-800',
      border: 'border-forest-200',
    },
  ];

  const totalListings = listings.length;
  const totalClaimed = claimedListings.length;
  const claimRate = totalListings > 0 ? Math.round((totalClaimed / totalListings) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">Impact Analytics</h1>
        <p className="text-stone-600">Measuring the real-world impact of food redistribution.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`card p-6 ${stat.border} hover:shadow-md transition-all duration-200`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className={`w-5 h-5 ${stat.text}`} />
              </div>
              <p className={`text-3xl sm:text-4xl font-extrabold ${stat.textDark} mb-1`}>
                {stat.value}
              </p>
              <p className="font-semibold text-stone-700 text-sm mb-0.5">{stat.label}</p>
              <p className="text-xs text-stone-500">{stat.sublabel}</p>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-stone-400" />
            <p className="text-xs text-stone-500 font-medium">Total Listings</p>
          </div>
          <p className="text-2xl font-bold text-stone-900">{totalListings}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-forest-500" />
            <p className="text-xs text-stone-500 font-medium">Edible Listings</p>
          </div>
          <p className="text-2xl font-bold text-forest-700">
            {listings.filter((l) => l.condition === 'edible').length}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Wheat className="w-4 h-4 text-earth-500" />
            <p className="text-xs text-stone-500 font-medium">Scrap Listings</p>
          </div>
          <p className="text-2xl font-bold text-earth-700">
            {listings.filter((l) => l.condition === 'spoiled').length}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-stone-400" />
            <p className="text-xs text-stone-500 font-medium">Claim Rate</p>
          </div>
          <p className="text-2xl font-bold text-stone-900">{claimRate}%</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="card p-6">
        <h2 className="font-bold text-stone-900 mb-4">Redistribution Breakdown</h2>
        <div className="space-y-4">
          <BreakdownBar
            label="Edible → NGOs"
            count={edibleClaimed.length}
            total={totalClaimed}
            color="bg-forest-500"
            textColor="text-forest-700"
          />
          <BreakdownBar
            label="Scraps → Farms & Biogas"
            count={spoiledClaimed.length}
            total={totalClaimed}
            color="bg-earth-500"
            textColor="text-earth-700"
          />
        </div>
        {totalClaimed === 0 && (
          <p className="text-sm text-stone-400 mt-4 text-center">
            No listings have been claimed yet. Once donors post and receivers claim, you'll see the impact here.
          </p>
        )}
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  count,
  total,
  color,
  textColor,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  textColor: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <span className={`text-sm font-semibold ${textColor}`}>{count}</span>
      </div>
      <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
