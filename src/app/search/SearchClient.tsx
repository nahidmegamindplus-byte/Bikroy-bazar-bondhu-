'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  X,
  Sparkles,
  MapPin,
} from 'lucide-react';
import AdCard from '@/components/AdCard';
import { useLanguage } from '@/context/LanguageContext';
import { toBanglaNumber } from '@/lib/utils';

interface SearchClientProps {
  categories: any[];
  divisions: any[];
}

export default function SearchClient({ categories, divisions }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isBangla, t } = useLanguage();

  const [ads, setAds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [selectedDivision, setSelectedDivision] = useState(searchParams.get('division') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [isUrgentOnly, setIsUrgentOnly] = useState(searchParams.get('urgent') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Fetch Ads with current filters
  const fetchAds = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    if (selectedDivision) params.set('division', selectedDivision);
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (condition) params.set('condition', condition);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (isFeaturedOnly) params.set('featured', 'true');
    if (isUrgentOnly) params.set('urgent', 'true');
    if (sort) params.set('sort', sort);

    try {
      const res = await fetch(`/api/ads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [
    query,
    selectedCategory,
    selectedSubcategory,
    selectedDivision,
    selectedDistrict,
    condition,
    minPrice,
    maxPrice,
    isFeaturedOnly,
    isUrgentOnly,
    sort,
  ]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleApplyFilter = () => {
    fetchAds();
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedDivision('');
    setSelectedDistrict('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setIsFeaturedOnly(false);
    setIsUrgentOnly(false);
    setSort('newest');
    router.push('/search');
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const activeDivisionObj = divisions.find((d) => d.slug === selectedDivision);

  return (
    <div>
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Sort Selector */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="price_asc">{t('sortPriceLow')}</option>
            <option value="price_desc">{t('sortPriceHigh')}</option>
            <option value="views">{t('sortPopular')}</option>
          </select>

          {/* Grid / List toggle */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg ${
                layout === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg ${
                layout === 'list'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs ml-auto"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: Filter Sidebar (Desktop) */}
        <div className="hidden md:block col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                {t('filters')}
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-500 font-semibold hover:underline"
              >
                {t('clearFilters')}
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Category Filter */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {isBangla ? 'ক্যাটাগরি' : 'Category'}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium"
                >
                  <option value="">{isBangla ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {isBangla ? c.nameBn : c.name}
                    </option>
                  ))}
                </select>

                {/* Subcategory */}
                {activeCategoryObj?.children && activeCategoryObj.children.length > 0 && (
                  <div className="mt-2 pl-2">
                    <label className="font-semibold text-slate-500 block mb-1">
                      {isBangla ? 'সাব-ক্যাটাগরি' : 'Subcategory'}
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium"
                    >
                      <option value="">{isBangla ? 'সব সাব-ক্যাটাগরি' : 'All Subcategories'}</option>
                      {activeCategoryObj.children.map((s: any) => (
                        <option key={s.id} value={s.slug}>
                          {isBangla ? s.nameBn : s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {isBangla ? 'বিভাগ ও জেলা' : 'Location'}
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedDistrict('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium"
                >
                  <option value="">{isBangla ? 'সমগ্র বাংলাদেশ' : 'All Bangladesh'}</option>
                  {divisions.map((d) => (
                    <option key={d.id} value={d.slug}>
                      {isBangla ? d.nameBn : d.name}
                    </option>
                  ))}
                </select>

                {activeDivisionObj?.children && activeDivisionObj.children.length > 0 && (
                  <div className="mt-2 pl-2">
                    <label className="font-semibold text-slate-500 block mb-1">
                      {isBangla ? 'জেলা' : 'District'}
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium"
                    >
                      <option value="">{isBangla ? 'সব জেলা' : 'All Districts'}</option>
                      {activeDivisionObj.children.map((dist: any) => (
                        <option key={dist.id} value={dist.slug}>
                          {isBangla ? dist.nameBn : dist.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {t('priceRange')} (৳)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {t('conditionLabel')}
                </label>
                <div className="space-y-1.5">
                  {['', 'NEW', 'USED', 'REFURBISHED'].map((cond) => (
                    <label
                      key={cond}
                      className="flex items-center gap-2 cursor-pointer font-medium text-slate-600 dark:text-slate-300"
                    >
                      <input
                        type="radio"
                        name="condition"
                        checked={condition === cond}
                        onChange={() => setCondition(cond)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        {cond === ''
                          ? isBangla ? 'সব অবস্থা' : 'Any Condition'
                          : cond === 'NEW'
                          ? t('conditionNew')
                          : cond === 'REFURBISHED'
                          ? t('conditionRefurbished')
                          : t('conditionUsed')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promotion Badges Toggles */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeaturedOnly}
                    onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>★ {t('featuredListings')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isUrgentOnly}
                    onChange={(e) => setIsUrgentOnly(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>🔥 {t('urgentListings')}</span>
                </label>
              </div>

              <button
                onClick={handleApplyFilter}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
              >
                {t('applyFilter')}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Ads Grid / List */}
        <div className="col-span-1 md:col-span-3">
          {/* Header Count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              {isBangla
                ? `${toBanglaNumber(total)}টি বিজ্ঞাপন পাওয়া গেছে`
                : `Showing ${total} advertisements`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-72 animate-pulse"
                />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                {t('noAdsFound')}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Try clearing some filters or searching with broader keywords like "toyota", "iphone", or "dhaka".
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                layout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
                  : 'space-y-4'
              }
            >
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} layout={layout} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Filters</span>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Mobile controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Division</label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="">All Bangladesh</option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.slug}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isFeaturedOnly}
                      onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                    />
                    <span>Featured Ads Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={handleClearFilters}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilter}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
