'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, ChevronDown, Check, RotateCcw, Sliders, Building2 } from 'lucide-react';

interface LocationStructure {
  [region: string]: {
    zones: {
      [zone: string]: string[]; // Simple array of famous cities directly inside Zone
    };
  };
}

// Optimized mock location database with States removed and direct famous cities added
const LOCATION_DATABASE: LocationStructure = {
  "APAC": {
    zones: {
      "NORTH INDIA": [
        "New Delhi", 
        "Noida", 
        "Gurugram", 
        "Amritsar", 
        "Ludhiana", 
        "Lucknow", 
        "Ghaziabad"
      ],
      "SOUTH INDIA": [
        "Bengaluru", 
        "Chennai", 
        "Kochi", 
        "Visakhapatnam", 
        "Coimbatore", 
        "Hyderabad"
      ],
      "EAST INDIA": [
        "Kolkata", 
        "Guwahati", 
        "Patna", 
        "Bhubaneswar", 
        "Siliguri", 
        "Ranchi"
      ],
      "WEST INDIA": [
        "Mumbai", 
        "Pune", 
        "Ahmedabad", 
        "Surat", 
        "Jaipur", 
        "Goa"
      ]
    }
  }
};

export default function AdvancedLocationFilter() {
  const [selectedRegion, setSelectedRegion] = useState<string>("APAC");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Controls custom select-list overlay modals
  const [activeDropdown, setActiveDropdown] = useState<'region' | 'zone' | 'city' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close active overlay dropdown sheets on clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSelectedZone(""); // Reset nested dynamic values
    setSelectedCity("");
    setActiveDropdown(null);
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedCity(""); // Reset nested dynamic values
    setActiveDropdown(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setActiveDropdown(null);
  };

  const resetAllFilters = () => {
    setSelectedRegion("");
    setSelectedZone("");
    setSelectedCity("");
    setActiveDropdown(null);
  };

  // Determine progressive expansion flags
  const isZoneUnlocked = !!selectedRegion;
  const isCityUnlocked = !!selectedRegion && !!selectedZone;

  // Derive target datasets based on higher-level variables
  const availableZones = selectedRegion ? Object.keys(LOCATION_DATABASE[selectedRegion]?.zones || {}) : [];
  const availableCities = (selectedRegion && selectedZone) ? LOCATION_DATABASE[selectedRegion].zones[selectedZone] || [] : [];

  return (
    <div 
      ref={containerRef}
      className="w-45 max-w-[240px] bg-slate-950/80 backdrop-blur-2xl border border-slate-800/90 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      {/* Widget Header area */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <Sliders size={12} className="text-orange-500" />
          <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Location Console
          </h3>
        </div>
        
        {/* Reset Trigger */}
        <button
          onClick={resetAllFilters}
          className="p-1 hover:bg-slate-800/80 rounded-lg text-slate-500 hover:text-orange-400 transition-all group"
          title="Reset selections"
        >
          <RotateCcw size={11} className="group-hover:rotate-[-45deg] transition-all duration-300" />
        </button>
      </div>

      {/* Stepper vertical stack with smooth expand/collapse transitions */}
      <div className="space-y-2">

        {/* ── STEP 1: REGION (Always visible, expands Region dropdown) ── */}
        <div className="relative">
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'region' ? null : 'region')}
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl p-2.5 flex items-center justify-between cursor-pointer select-none transition-all duration-300 shadow-[0_4px_12px_rgba(249,115,22,0.15)] border border-orange-400/10 group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <ChevronDown size={14} className={`text-white transition-transform duration-300 ${activeDropdown === 'region' ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[8px] font-black tracking-widest text-orange-200 uppercase">
                  REGION
                </span>
                <span className="block text-[12px] font-black tracking-wide text-white">
                  {selectedRegion || "SELECT REGION..."}
                </span>
              </div>
            </div>
            
            <div className="border-l border-white/20 pl-2.5 h-7 flex items-center justify-center">
              <Globe size={15} className="text-white/95 animate-[spin_30s_linear_infinite]" />
            </div>
          </div>

          {/* Region Dropdown menu */}
          {activeDropdown === 'region' && (
            <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-850 rounded-lg p-1 shadow-2xl z-50 max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              {Object.keys(LOCATION_DATABASE).map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold rounded-md text-slate-300 hover:bg-orange-500/10 hover:text-white transition-all text-left"
                >
                  <span>{region}</span>
                  {selectedRegion === region && <Check size={11} className="text-orange-400" />}
                </button>
              ))}
            </div>
          )}
        </div>


        {/* ── STEP 2: ZONE (Expands dynamically after Region selection) ── */}
        <div className={`transition-all duration-500 ease-in-out ${isZoneUnlocked ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="relative">
            <div
              onClick={() => isZoneUnlocked && setActiveDropdown(activeDropdown === 'zone' ? null : 'zone')}
              className={`w-full rounded-xl p-2.5 flex items-center justify-between select-none transition-all duration-300 border
                ${selectedZone 
                  ? 'bg-white border-emerald-500 text-slate-800 shadow-sm cursor-pointer' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-pointer'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors
                  ${selectedZone 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-500' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <MapPin size={13} />
                </div>
                <div className="text-left leading-tight">
                  <span className={`block text-[8px] font-black tracking-widest uppercase
                    ${selectedZone ? 'text-emerald-600' : 'text-slate-500'}`}
                  >
                    ZONE
                  </span>
                  <span className={`block text-[12px] font-black tracking-wide
                    ${selectedZone ? 'text-slate-800' : 'text-slate-400'}`}
                  >
                    {selectedZone || "Select Zone..."}
                  </span>
                </div>
              </div>

              <ChevronDown size={13} className={`text-slate-500 transition-transform duration-300 ${activeDropdown === 'zone' ? 'rotate-180' : ''}`} />
            </div>

            {/* Zone Dropdown overlay */}
            {activeDropdown === 'zone' && isZoneUnlocked && (
              <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-850 rounded-lg p-1 shadow-2xl z-50 max-h-40 overflow-y-auto">
                {availableZones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => handleZoneSelect(zone)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold rounded-md text-slate-300 hover:bg-emerald-500/10 hover:text-white transition-all text-left"
                  >
                    <span>{zone}</span>
                    {selectedZone === zone && <Check size={11} className="text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* ── STEP 3: CITY (Expands dynamically after Zone selection) ── */}
        <div className={`transition-all duration-500 ease-in-out ${isCityUnlocked ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="relative">
            <div
              onClick={() => isCityUnlocked && setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
              className={`w-full rounded-xl p-2.5 flex items-center justify-between select-none transition-all duration-300 border
                ${selectedCity 
                  ? 'bg-white border-purple-500 text-slate-800 shadow-sm cursor-pointer' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-pointer'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors
                  ${selectedCity 
                    ? 'bg-purple-50 border-purple-100 text-purple-500' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <Building2 size={13} />
                </div>
                <div className="text-left leading-tight">
                  <span className={`block text-[8px] font-black tracking-widest uppercase
                    ${selectedCity ? 'text-purple-600' : 'text-slate-500'}`}
                  >
                    FAMOUS CITY
                  </span>
                  <span className={`block text-[12px] font-black tracking-wide
                    ${selectedCity ? 'text-slate-800' : 'text-slate-400'}`}
                  >
                    {selectedCity || "Select Famous City..."}
                  </span>
                </div>
              </div>

              <ChevronDown size={13} className={`text-slate-500 transition-transform duration-300 ${activeDropdown === 'city' ? 'rotate-180' : ''}`} />
            </div>

            {/* City Dropdown overlay */}
            {activeDropdown === 'city' && isCityUnlocked && (
              <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-850 rounded-lg p-1 shadow-2xl z-50 max-h-40 overflow-y-auto">
                {availableCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold rounded-md text-slate-300 hover:bg-purple-500/10 hover:text-white transition-all text-left"
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Check size={11} className="text-purple-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Decorative filter indicator footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
        <span>Active Scope</span>
        <span className="text-orange-400">
          { [selectedRegion, selectedZone, selectedCity].filter(Boolean).length } / 3 Selectors
        </span>
      </div>
    </div>
  );
}
