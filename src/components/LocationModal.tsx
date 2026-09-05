'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LocationItem {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  children?: LocationItem[];
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { division?: LocationItem; district?: LocationItem; area?: LocationItem } | null) => void;
  selectedLocation: { division?: LocationItem; district?: LocationItem; area?: LocationItem } | null;
}

export default function LocationModal({ isOpen, onClose, onSelect, selectedLocation }: LocationModalProps) {
  const { isBangla, t } = useLanguage();
  const [divisions, setDivisions] = useState<LocationItem[]>([]);
  const [activeDivision, setActiveDivision] = useState<LocationItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/locations')
        .then((res) => res.json())
        .then((data) => {
          if (data.divisions) {
            setDivisions(data.divisions);
            if (!activeDivision && data.divisions.length > 0) {
              setActiveDivision(data.divisions[0]);
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBangla ? 'লোকেশন নির্বাচন করুন' : 'Select Location'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBangla ? 'আপনার এলাকার বিজ্ঞাপন দেখতে এলাকা বেছে নিন' : 'Choose your area to see local advertisements'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Option: All Bangladesh */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
          <button
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <MapPin className="w-4 h-4" />
            {t('allBangladesh')}
          </button>
          {!selectedLocation && (
            <span className="text-xs bg-emerald-600 text-white font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Selected
            </span>
          )}
        </div>

        {/* Split Grid: Divisions on left, Districts/Areas on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 h-96">
          {/* Divisions */}
          <div className="overflow-y-auto p-3 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
              {isBangla ? 'বিভাগসমূহ' : 'Divisions'}
            </span>
            {divisions.map((div) => {
              const isSelected = activeDivision?.id === div.id;
              return (
                <button
                  key={div.id}
                  onClick={() => setActiveDivision(div)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{isBangla ? div.nameBn : div.name}</span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Districts / Areas of Active Division */}
          <div className="overflow-y-auto p-3 space-y-2">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeDivision ? (isBangla ? activeDivision.nameBn : activeDivision.name) : ''} - {isBangla ? 'জেলা ও এলাকা' : 'Districts & Areas'}
              </span>
              {activeDivision && (
                <button
                  onClick={() => {
                    onSelect({ division: activeDivision });
                    onClose();
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  {isBangla ? 'পুরো বিভাগ' : 'All of this division'}
                </button>
              )}
            </div>

            {activeDivision?.children?.map((district) => (
              <div key={district.id} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5">
                <button
                  onClick={() => {
                    onSelect({ division: activeDivision, district });
                    onClose();
                  }}
                  className="w-full text-left font-semibold text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-between mb-1"
                >
                  <span>{isBangla ? district.nameBn : district.name}</span>
                  <span className="text-xs text-emerald-600 font-normal hover:underline">Select</span>
                </button>

                {district.children && district.children.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {district.children.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => {
                          onSelect({ division: activeDivision, district, area });
                          onClose();
                        }}
                        className="text-xs px-2.5 py-1 bg-white dark:bg-slate-700/80 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg border border-slate-200 dark:border-slate-700 transition"
                      >
                        {isBangla ? area.nameBn : area.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
