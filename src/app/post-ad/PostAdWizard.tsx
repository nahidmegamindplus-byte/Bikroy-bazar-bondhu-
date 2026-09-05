'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Star,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  Car,
  Smartphone,
  Home,
  Armchair,
  Shirt,
  Briefcase,
  Wrench,
  Sprout,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceBDT } from '@/lib/utils';
import AuthModal from '@/components/AuthModal';

const iconMap: { [key: string]: any } = {
  Car: Car,
  Smartphone: Smartphone,
  Home: Home,
  Armchair: Armchair,
  Shirt: Shirt,
  Briefcase: Briefcase,
  Wrench: Wrench,
  Sprout: Sprout,
};

interface PostAdWizardProps {
  categories: any[];
  divisions: any[];
}

export default function PostAdWizard({ categories, divisions }: PostAdWizardProps) {
  const router = useRouter();
  const { isBangla, t } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step 1 & 2: Category & Subcategory
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);

  // Step 3: Information & Dynamic Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [condition, setCondition] = useState('USED');
  const [description, setDescription] = useState('');
  const [dynamicAttributes, setDynamicAttributes] = useState<{ [key: string]: string }>({});

  // Step 4: Images
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Step 5: Location
  const [selectedDivision, setSelectedDivision] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [address, setAddress] = useState('');

  // Step 6: Contact
  const [phone, setPhone] = useState(user?.phone || '017XXXXXXXX');
  const [showPhone, setShowPhone] = useState(true);

  // Helper for dynamic fields
  const activeFields = selectedCategory?.fields || [];

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    const selected = imageUrls[index];
    const rest = imageUrls.filter((_, i) => i !== index);
    setImageUrls([selected, ...rest]);
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          isNegotiable,
          condition,
          categoryId: selectedCategory.id,
          subcategoryId: selectedSubcategory?.id || null,
          divisionId: selectedDivision?.id || null,
          districtId: selectedDistrict?.id || null,
          areaId: selectedArea?.id || null,
          address,
          sellerPhone: phone,
          showPhone,
          images: imageUrls,
          attributes: dynamicAttributes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/ad/${data.ad.id}`);
      } else {
        setSubmitError(data.error || 'Failed to post advertisement');
      }
    } catch {
      setSubmitError('An error occurred during submission');
    } finally {
      setSubmitting(false);
    }
  };

  // Step indicator steps
  const stepsList = [
    { num: 1, label: t('stepCategory') },
    { num: 2, label: t('stepDetails') },
    { num: 3, label: t('stepImages') },
    { num: 4, label: t('stepLocation') },
    { num: 5, label: t('previewAd') },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10">
      {/* Title & Step Tracker */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
          {t('postAdTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 text-center mt-1">
          {isBangla ? 'সহজ ৫টি ধাপে আপনার বিজ্ঞাপন বিনামূল্যে প্রকাশ করুন' : 'Publish your advertisement in 5 easy steps'}
        </p>

        {/* Progress Bar */}
        <div className="mt-8 flex items-center justify-between relative max-w-xl mx-auto">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -z-0" />
          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/80 shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-emerald-600 font-bold' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* STEP 1: Select Category & Subcategory */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              {t('selectCategoryPrompt')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const IconComponent = (cat.icon && iconMap[cat.icon]) || Car;
                const isSelected = selectedCategory?.id === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory(null);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition flex flex-col items-center justify-center gap-2 text-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-semibold">{isBangla ? cat.nameBn : cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCategory && selectedCategory.children?.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                {t('selectSubcategoryPrompt')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {selectedCategory.children.map((sub: any) => {
                  const isSelected = selectedSubcategory?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{isBangla ? sub.nameBn : sub.name}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedCategory}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <span>{isBangla ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: General & Category-Specific Dynamic Fields */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('adTitleLabel')} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('adTitlePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('priceLabel')} *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>{t('isNegotiableLabel')}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('conditionLabel')}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="USED">{t('conditionUsed')}</option>
                  <option value="NEW">{t('conditionNew')}</option>
                  <option value="REFURBISHED">{t('conditionRefurbished')}</option>
                </select>
              </div>
            </div>

            {/* Dynamic Custom Fields of the category */}
            {activeFields.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {selectedCategory?.name} {t('specifications')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeFields.map((field: any) => {
                    let options: string[] = [];
                    if (field.optionsJson) {
                      try {
                        options = JSON.parse(field.optionsJson);
                      } catch {}
                    }

                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {isBangla ? field.nameBn : field.name} {field.unit ? `(${field.unit})` : ''}
                        </label>
                        {field.fieldType === 'select' ? (
                          <select
                            value={dynamicAttributes[field.fieldKey] || ''}
                            onChange={(e) =>
                              setDynamicAttributes({
                                ...dynamicAttributes,
                                [field.fieldKey]: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Select option</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.fieldType === 'number' ? 'number' : 'text'}
                            value={dynamicAttributes[field.fieldKey] || ''}
                            onChange={(e) =>
                              setDynamicAttributes({
                                ...dynamicAttributes,
                                [field.fieldKey]: e.target.value,
                              })
                            }
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('descriptionLabel')} *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold flex items-center gap-1.5 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!title || !price || !description}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <span>{isBangla ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Images Drag & Drop + Cover Selector */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {t('uploadPhotos')}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{t('photoTips')}</p>

            {/* URL Uploader */}
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL or Unsplash link..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Add Image
              </button>
            </div>

            {/* Quick Presets for Demo */}
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium">Quick demo presets:</span>
              <button
                type="button"
                onClick={() =>
                  setImageUrls([
                    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
                  ])
                }
                className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 hover:bg-emerald-50 text-[11px]"
              >
                Car Photos
              </button>
              <button
                type="button"
                onClick={() =>
                  setImageUrls([
                    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
                  ])
                }
                className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 hover:bg-emerald-50 text-[11px]"
              >
                Phone Photos
              </button>
              <button
                type="button"
                onClick={() =>
                  setImageUrls([
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
                  ])
                }
                className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 hover:bg-emerald-50 text-[11px]"
              >
                Apartment Photos
              </button>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-900"
                >
                  <Image src={url} alt="" fill className="object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Cover Photo
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        title="Set as cover"
                        className="p-1.5 bg-white text-slate-900 rounded-lg hover:scale-110 transition"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Delete"
                      className="p-1.5 bg-rose-600 text-white rounded-lg hover:scale-110 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold flex items-center gap-1.5 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={imageUrls.length === 0}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <span>{isBangla ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Location & Contact Privacy */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('stepLocation')}
            </h3>

            {/* Division */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('selectDivision')} *
              </label>
              <select
                value={selectedDivision?.id || ''}
                onChange={(e) => {
                  const div = divisions.find((d) => d.id === e.target.value);
                  setSelectedDivision(div);
                  setSelectedDistrict(null);
                  setSelectedArea(null);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isBangla ? d.nameBn : d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            {selectedDivision && selectedDivision.children?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('selectDistrict')} *
                </label>
                <select
                  value={selectedDistrict?.id || ''}
                  onChange={(e) => {
                    const dist = selectedDivision.children.find((d: any) => d.id === e.target.value);
                    setSelectedDistrict(dist);
                    setSelectedArea(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select District</option>
                  {selectedDivision.children.map((dist: any) => (
                    <option key={dist.id} value={dist.id}>
                      {isBangla ? dist.nameBn : dist.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Area */}
            {selectedDistrict && selectedDistrict.children?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('selectArea')}
                </label>
                <select
                  value={selectedArea?.id || ''}
                  onChange={(e) => {
                    const a = selectedDistrict.children.find((ar: any) => ar.id === e.target.value);
                    setSelectedArea(a);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Area</option>
                  {selectedDistrict.children.map((ar: any) => (
                    <option key={ar.id} value={ar.id}>
                      {isBangla ? ar.nameBn : ar.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('addressLabel')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Road / Landmark address"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Contact & Phone Privacy */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Contact Preferences
              </h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('phoneLabel')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 mt-3 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>{t('showPhonePublicly')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold flex items-center gap-1.5 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!selectedDivision || !phone}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <span>{isBangla ? 'প্রিভিউ দেখুন' : 'Preview Listing'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Live Preview Card & Submit */}
      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Review & Publish
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Please review your advertisement details before submitting.
            </p>

            {/* Live Preview Card */}
            <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-900 mb-4">
                <Image src={imageUrls[0]} alt="" fill className="object-cover" />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {condition}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2">
                {title}
              </h4>
              <span className="text-xl font-black text-emerald-600 block mt-2">
                {formatPriceBDT(parseFloat(price) || 0, isBangla)}
              </span>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
                <p>
                  📍 {selectedArea?.name || selectedDistrict?.name || selectedDivision?.name}
                </p>
                <p>📞 {showPhone ? phone : 'Protected (In-app chat only)'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(4)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold flex items-center gap-1.5 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-sm shadow-md transition disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : t('submitAd')}
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal Trigger if not logged in */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
