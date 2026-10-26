import React, { useState, useEffect } from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/apiService';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, data, className = "", isSaved: initialIsSaved }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialIsSaved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Sync with initialIsSaved if it changes
  useEffect(() => {
    if (initialIsSaved !== undefined) {
      setIsSaved(initialIsSaved);
    }
  }, [initialIsSaved]);

  const item = property || data;

  if (!item) return null;

  const {
    _id,
    name,
    address,
    images,
    propertyType,
    rating,
    startingPrice,
    details
  } = item;

  const handleToggleSave = async (e) => {
    e.stopPropagation(); // Don't navigate to details
    if (!localStorage.getItem('token')) {
      toast.error("Please login to save properties");
      return;
    }

    if (saveLoading) return;

    setSaveLoading(true);
    const newState = !isSaved;
    setIsSaved(newState); // Optimistic update

    try {
      await userService.toggleSavedHotel(_id || item.id);
      toast.success(newState ? "Added to wishlist" : "Removed from wishlist");
    } catch (error) {
      setIsSaved(!newState); // Revert
      toast.error("Failed to update wishlist");
    } finally {
      setSaveLoading(false);
    }
  };

  // Function to clean dirty URLs (handles backticks, spaces, quotes)
  const cleanImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    // Remove backticks, single quotes, double quotes, and surrounding whitespace
    return url.replace(/[`'"]/g, '').trim();
  };

  const displayName = name || item.propertyName || 'Untitled';

  const typeRaw = (propertyType || item.propertyType || '').toString();
  const normalizedType = typeRaw
    ? typeRaw.toLowerCase() === 'pg'
      ? 'PG'
      : typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1).toLowerCase()
    : '';
  const typeForBadge = normalizedType || typeRaw;
  const typeLabel = typeForBadge ? typeForBadge.toString().toUpperCase() : '';

  // Improved Rating Logic
  const rawRating =
    item.avgRating !== undefined ? item.avgRating :
      item.rating !== undefined ? item.rating :
        rating;

  const reviewCount = item.totalReviews || item.reviews || 0;

  // Show rating if it exists and is > 0, otherwise show 'New'
  // Or if user specifically wants to see 0.0, we can adjust. 
  // Standard is: if no reviews, show New.
  const displayRating = (Number(rawRating) > 0) ? Number(rawRating).toFixed(1) : 'New';

  // Improved Price Logic - Check more fields
  const rawPrice =
    startingPrice ??
    item.startingPrice ??
    item.minPrice ??
    item.min_price ??
    item.price ??
    item.costPerNight ??
    item.amount ??
    null;

  const displayPrice =
    typeof rawPrice === 'number' && rawPrice > 0 ? rawPrice : null;

  const imageSrc =
    images?.cover ||
    cleanImageUrl(item.coverImage) ||
    cleanImageUrl(
      Array.isArray(item.propertyImages) ? item.propertyImages[0] : ''
    ) ||
    'https://via.placeholder.com/400x300?text=No+Image';

  const badgeTypeKey = normalizedType || typeRaw;

  const locationText = (() => {
    const area = address?.area || item.area;
    const city = address?.city || item.city;
    return area && area.trim() ? `${area}, ${city}` : (city || 'Nearby');
  })();

  return (
    <div
      onClick={() => navigate(`/hotel/${_id}`)}
      className={`group relative bg-[#FFFDF8] rounded-[22px] border border-emerald-100/80 shadow-[0_8px_24px_-14px_rgba(43,38,32,0.35)] overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-300 hover:shadow-[0_14px_30px_-14px_rgba(43,38,32,0.45)] ${className}`}
    >
      <div className="relative aspect-[16/10] bg-emerald-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />

        <button
          onClick={handleToggleSave}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-sm z-20 hover:bg-white active:scale-90 transition-all"
        >
          <Heart size={15} className={isSaved ? 'fill-red-500 text-red-500' : 'text-textDark'} />
        </button>

        {typeLabel && (
          <div className="absolute top-3 left-3 flex items-center gap-1 z-10">
            <div className="px-2.5 py-1 bg-[#FFFDF8]/95 rounded-full text-[10px] uppercase tracking-wider font-bold text-emerald-800">
              {typeLabel}
            </div>
            {(item.starRating || item.config?.starRating) && (
              <div className="px-2 py-1 bg-emerald-600 rounded-full text-[10px] font-bold text-white">
                ★ {item.starRating || item.config?.starRating}
              </div>
            )}
          </div>
        )}

        {item.suitability && item.suitability !== 'none' && (
          <div className="absolute bottom-3 left-3 bg-teal-700/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold z-10">
            {item.suitability === 'Both' ? 'FRIENDLY' : item.suitability.toUpperCase()}
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-4">
        <h3 className="font-serif font-semibold text-[17px] text-textDark line-clamp-1">
          {displayName}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 mt-0.5">
          <MapPin size={12} className="shrink-0" />
          <span className="text-xs font-medium truncate">{locationText}</span>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="flex items-center gap-1 text-xs font-bold text-textDark">
            <Star size={13} className="fill-emerald-600 text-emerald-600" />
            {displayRating}
            {reviewCount > 0 && <span className="font-medium text-slate-400">({reviewCount})</span>}
          </div>

          <div className="text-right leading-tight">
            <span className="block text-[10px] font-medium text-slate-400">From</span>
            <span className="font-sans font-extrabold text-lg text-textDark">
              {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'Check'}
            </span>
            {displayPrice && <span className="text-[11px] text-slate-400 ml-0.5">/ night</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
