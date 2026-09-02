import { Leaf, Users, Wheat, ArrowRight, Recycle, Heart, Zap } from 'lucide-react';

interface LandingProps {
  onJoin: () => void;
  onNavigate: (page: string) => void;
}

export default function Landing({ onJoin, onNavigate }: LandingProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-50 via-stone-50 to-stone-50">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s10 4.5 10 10zm0 0c0-5.5 4.5-10 10-10s-10 4.5-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100 text-forest-700 text-sm font-medium mb-6">
              <Recycle className="w-4 h-4" />
              Zero Food Waste Initiative
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.1] mb-6">
              Feed People, Fuel Farms.{' '}
              <span className="bg-gradient-to-r from-forest-600 to-earth-600 bg-clip-text text-transparent">
                Zero Waste.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              A dual-tier redistribution platform connecting donors with NGOs for edible food
              and farms/biogas plants for spoiled scraps. Every meal served, every kilo
              redirected, every gram of CO2 saved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onJoin}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 text-white font-semibold text-lg hover:bg-stone-800 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Join the Loop
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-stone-700 font-semibold text-lg border border-stone-300 hover:bg-stone-50 transition-all duration-200 active:scale-95"
              >
                View Impact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Path Visual */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              Two Paths, One Mission
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              Food takes different routes depending on its condition. Good food nourishes
              people. Spoiled food nourishes the land and powers communities.
            </p>
          </div>

          {/* Source node */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-stone-900 flex items-center justify-center shadow-lg mb-3">
              <Leaf className="w-9 h-9 text-white" />
            </div>
            <p className="font-semibold text-stone-900">Surplus Food</p>
            <p className="text-sm text-stone-500">From donors</p>

            {/* Split lines */}
            <div className="w-full max-w-4xl mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
                {/* Connecting line on desktop */}
                <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-stone-300" />

                {/* Path 1: Edible → NGO */}
                <div className="flex flex-col items-center">
                  <div className="w-full h-1 md:h-2 bg-gradient-to-r from-forest-400 to-forest-600 rounded-full mb-6" />
                  <div className="card p-6 w-full border-forest-200 hover:border-forest-400 hover:shadow-lg cursor-pointer transition-all duration-200"
                    onClick={() => onNavigate('ngo')}>
                    <div className="w-14 h-14 rounded-xl bg-forest-500 flex items-center justify-center mb-4 mx-auto">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-forest-800 text-center mb-2">
                      Good Food → NGOs
                    </h3>
                    <p className="text-sm text-stone-600 text-center mb-4">
                      Safe, edible surplus goes to food shelters and NGOs for distribution
                      to people who need it most.
                    </p>
                    <div className="flex items-center justify-center gap-1 text-forest-600 font-medium text-sm">
                      View NGO Feed
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Path 2: Spoiled → Farm/Biogas */}
                <div className="flex flex-col items-center">
                  <div className="w-full h-1 md:h-2 bg-gradient-to-r from-earth-400 to-earth-600 rounded-full mb-6" />
                  <div className="card p-6 w-full border-earth-200 hover:border-earth-400 hover:shadow-lg cursor-pointer transition-all duration-200"
                    onClick={() => onNavigate('farm')}>
                    <div className="w-14 h-14 rounded-xl bg-earth-500 flex items-center justify-center mb-4 mx-auto">
                      <Wheat className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-earth-800 text-center mb-2">
                      Spoiled Food → Farms & Biogas
                    </h3>
                    <p className="text-sm text-stone-600 text-center mb-4">
                      Scraps and spoiled food go to dairy farms, poultry farms, and biogas
                      plants for animal feed and energy production.
                    </p>
                    <div className="flex items-center justify-center gap-1 text-earth-600 font-medium text-sm">
                      View Farm Feed
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-forest-500 mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-extrabold">1,240+</p>
              <p className="text-stone-400 text-sm">Meals Served</p>
            </div>
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-earth-500 mx-auto mb-3">
                <Wheat className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-extrabold">860 kg</p>
              <p className="text-stone-400 text-sm">Feed & Compost Redirected</p>
            </div>
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-forest-400 mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-extrabold">3.2t</p>
              <p className="text-stone-400 text-sm">CO2 Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
            Ready to close the loop?
          </h2>
          <p className="text-stone-600 mb-8">
            Whether you have surplus food to share or you're looking to receive it, joining
            takes less than a minute.
          </p>
          <button
            onClick={onJoin}
            className="px-8 py-4 rounded-xl bg-stone-900 text-white font-semibold text-lg hover:bg-stone-800 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Join the Loop
          </button>
        </div>
      </section>
    </div>
  );
}
