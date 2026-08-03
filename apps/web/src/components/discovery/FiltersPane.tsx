'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import { getToken } from "@/app/actions/auth";
import toast from 'react-hot-toast';

export default function FiltersPane() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  

  const [industrySearch, setIndustrySearch] = useState('');
  
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSearches() {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/saved-searches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedSearches(data);
        }
      } catch (err) {
        console.error('Failed to fetch saved searches', err);
      }
    }
    fetchSearches();
  }, [getToken]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSavedDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveSearch = async () => {
    if (!newSearchName.trim()) return;
    try {
      const token = await getToken();
      
      const queryObj: Record<string, string> = {};
      searchParams.forEach((val, key) => { queryObj[key] = val; });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/saved-searches`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newSearchName, query: queryObj })
      });
      if (res.ok) {
        const newSearch = await res.json();
        setSavedSearches([newSearch, ...savedSearches]);
        setShowSaveModal(false);
        setNewSearchName('');
      }
    } catch (err) {
      console.error('Failed to save search', err);
    }
  };

  const applySavedSearch = (query: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => params.set(k, v));
    
    setKeywordFilter(query.keywords || '');
    setCountryFilter(query.country || '');
    setStateFilter(query.state || '');
    setCityFilter(query.city || '');
    setPostalFilter(query.postal || '');
    setRadiusFilter(query.radius || '');

    router.push(pathname + '?' + params.toString());
    setShowSavedDropdown(false);
  };

  // Example options based on design
  const locations = ['United States', 'Europe', 'North America'];
  const industries = ['SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'Cloud Infrastructure', 'Cybersecurity', 'Artificial Intelligence & ML'];

  // Optional Filters
  const [keywordFilter, setKeywordFilter] = useState(searchParams.get('search') || '');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '');
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || '');
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
  const [postalFilter, setPostalFilter] = useState(searchParams.get('postal') || '');
  const [radiusFilter, setRadiusFilter] = useState(searchParams.get('radius') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // Handle multiple selections for locations/industries
      if (name === 'locations' || name === 'industries') {
        let currentValues = params.get(name)?.split(',') || [];
        if (currentValues.includes(value)) {
          currentValues = currentValues.filter((v) => v !== value);
        } else {
          currentValues.push(value);
        }
        
        if (currentValues.length > 0) {
          params.set(name, currentValues.join(','));
        } else {
          params.delete(name);
        }
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCheckboxChange = (type: 'locations' | 'industries', value: string) => {
    router.push(pathname + '?' + createQueryString(type, value));
  };

  const handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>, paramName: string, value: string) => {
    if (e.key === 'Enter') {
      router.push(pathname + '?' + createQueryString(paramName, value));
    }
  };

  const handleReset = () => {
    router.push(pathname);
    setKeywordFilter('');
    setCountryFilter('');
    setStateFilter('');
    setCityFilter('');
    setPostalFilter('');
    setRadiusFilter('');
  };

  const selectedLocations = searchParams.get('locations')?.split(',') || [];
  const selectedIndustries = searchParams.get('industries')?.split(',') || [];

  return (
    <section className="w-full xl:w-60 flex-shrink-0 flex flex-col bg-surface-container-low border-b xl:border-b-0 xl:border-r border-outline-variant p-4 xl:p-6 h-auto xl:h-full overflow-visible xl:overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-2 mb-8">
        <button onClick={() => toast.success('Search applied!')} className="w-full flex items-center justify-center gap-2 py-2 bg-primary-container text-on-primary-container rounded-lg font-label-md hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">search</span>
          Search
        </button>
        <button onClick={() => toast('AI Search functionality coming soon!', { icon: '✨' })} className="w-full flex items-center justify-center gap-2 py-2 bg-surface-container-high text-on-surface rounded-lg border border-outline-variant font-label-md hover:border-primary-container transition-colors ai-glow">
          <span className="material-symbols-outlined text-[18px] text-primary-container">auto_awesome</span>
          AI Search
        </button>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowSavedDropdown(!showSavedDropdown)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-surface text-on-surface-variant rounded-lg border border-outline-variant font-label-md hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            Saved Searches
          </button>
          
          {showSavedDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 overflow-hidden">
              <button 
                onClick={() => {
                  setShowSavedDropdown(false);
                  setShowSaveModal(true);
                }}
                className="w-full text-left px-4 py-3 text-sm font-label-md text-primary-container hover:bg-surface-container-highest border-b border-outline-variant flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span> Save Current Search...
              </button>
              <div className="max-h-60 overflow-y-auto">
                {savedSearches.length > 0 ? (
                  savedSearches.map(s => (
                    <button
                      key={s.id}
                      onClick={() => applySavedSearch(s.query)}
                      className="w-full text-left px-4 py-2.5 text-sm font-body-md text-on-surface hover:bg-surface-container-highest border-b border-outline-variant/50 last:border-0 truncate"
                    >
                      {s.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-on-surface-variant italic text-center">No saved searches</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-surface-container-high p-6 rounded-2xl w-96 border border-outline-variant shadow-2xl">
            <h3 className="font-headline-md text-on-surface mb-4">Save Current Search</h3>
            <input 
              autoFocus
              type="text" 
              placeholder="e.g. ⭐ Healthcare USA" 
              value={newSearchName}
              onChange={e => setNewSearchName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container text-on-surface text-sm border border-outline-variant rounded-lg mb-6 outline-none focus:border-primary-container"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-on-surface-variant font-label-md hover:bg-surface-container rounded-lg">Cancel</button>
              <button onClick={handleSaveSearch} disabled={!newSearchName.trim()} className="px-4 py-2 bg-primary-container text-on-primary-container font-label-md rounded-lg hover:opacity-90 disabled:opacity-50">Save Search</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-label-sm text-on-surface-variant uppercase tracking-widest">Filters</h2>
        <button onClick={handleReset} className="text-primary-container font-label-sm hover:underline">Reset All</button>
      </div>

      <div className="space-y-8 pb-10">
        
        {/* Keywords */}
        <div>
          <label className="font-body-md font-bold text-on-surface mb-3 block">Keywords</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="e.g. B2B, Series A"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              onKeyDown={(e) => handleInputChange(e, 'search', keywordFilter)}
              className="w-full pl-8 pr-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
            />
          </div>
        </div>

        {/* Location Checkboxes (Broad) */}
        <div>
          <label className="font-body-md font-bold text-on-surface mb-3 block">Broad Region</label>
          <div className="space-y-2">
            {locations.map((loc) => (
              <label key={loc} className="flex items-center gap-3 font-body-md text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(loc)}
                  onChange={() => handleCheckboxChange('locations', loc)}
                  className="rounded-lg text-primary-container focus:ring-primary-container bg-surface-container border-outline-variant"
                />
                {loc}
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Location Inputs */}
        <div className="space-y-3">
          <label className="font-body-md font-bold text-on-surface block">Detailed Location</label>
          <input
            type="text"
            placeholder="Country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            onKeyDown={(e) => handleInputChange(e, 'country', countryFilter)}
            className="w-full px-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="State"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              onKeyDown={(e) => handleInputChange(e, 'state', stateFilter)}
              className="w-1/2 px-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
            />
            <input
              type="text"
              placeholder="City"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              onKeyDown={(e) => handleInputChange(e, 'city', cityFilter)}
              className="w-1/2 px-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Postal Code"
              value={postalFilter}
              onChange={(e) => setPostalFilter(e.target.value)}
              onKeyDown={(e) => handleInputChange(e, 'postal', postalFilter)}
              className="w-1/2 px-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
            />
            <input
              type="text"
              placeholder="Radius (mi)"
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(e.target.value)}
              onKeyDown={(e) => handleInputChange(e, 'radius', radiusFilter)}
              className="w-1/2 px-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="font-body-md font-bold text-on-surface mb-3 block">Industry</label>
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search industries..."
              value={industrySearch}
              onChange={(e) => setIndustrySearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-md text-xs outline-none focus:border-primary-container transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {industries
              .filter(ind => ind.toLowerCase().includes(industrySearch.toLowerCase()))
              .map(ind => {
              const isSelected = selectedIndustries.includes(ind);
              return (
                <span
                  key={ind}
                  onClick={() => handleCheckboxChange('industries', ind)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-lg border cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary-container/10 text-primary-container border-primary-container/20'
                      : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  {ind}
                </span>
              );
            })}
          </div>
        </div>

        {/* Employee Size (Simplified Slider for MVP) */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-body-md font-bold text-on-surface">Employee Size</label>
            <span className="font-label-sm text-primary-container">250 - 1k</span>
          </div>
          <input
            type="range"
            className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
          />
          <div className="flex justify-between mt-2 font-label-sm text-on-surface-variant">
            <span>1</span>
            <span>10k+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
