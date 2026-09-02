import { useState, useEffect, useCallback } from 'react';
import Navbar, { RoleModal } from '@/components/Navbar';
import Landing from '@/components/Landing';
import DonorDashboard from '@/components/DonorDashboard';
import NGOFeed from '@/components/NGOFeed';
import FarmFeed from '@/components/FarmFeed';
import Analytics from '@/components/Analytics';
import { supabase } from '@/lib/supabase';
import type { Listing, UserRole } from '@/types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return;
    }

    setListings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();

    const channel = supabase
      .channel('listings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
        fetchListings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchListings]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = (role: UserRole) => {
    if (role === 'donor') handleNavigate('donor');
    else if (role === 'ngo') handleNavigate('ngo');
    else if (role === 'farm') handleNavigate('farm');
  };

  const edibleListings = listings.filter((l) => l.condition === 'edible');
  const spoiledListings = listings.filter((l) => l.condition === 'spoiled');

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onJoin={() => setRoleModalOpen(true)}
      />

      <main>
        {currentPage === 'landing' && (
          <Landing onJoin={() => setRoleModalOpen(true)} onNavigate={handleNavigate} />
        )}
        {currentPage === 'donor' && (
          <DonorDashboard onPosted={fetchListings} />
        )}
        {currentPage === 'ngo' && (
          <NGOFeed listings={edibleListings} loading={loading} onClaim={fetchListings} />
        )}
        {currentPage === 'farm' && (
          <FarmFeed listings={spoiledListings} loading={loading} onClaim={fetchListings} />
        )}
        {currentPage === 'analytics' && (
          <Analytics listings={listings} loading={loading} />
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-stone-500">
            FoodLoop — Feed People, Fuel Farms. Zero Waste.
          </p>
        </div>
      </footer>

      <RoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}
