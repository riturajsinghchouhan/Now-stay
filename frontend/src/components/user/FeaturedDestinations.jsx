import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/apiService';

const cleanUrl = (url) => (typeof url === 'string' ? url.replace(/[`'"]/g, '').trim() : '');

const FeaturedDestinations = () => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await propertyService.getPublic({});
                if (!alive || !Array.isArray(data)) return;
                const byCity = new Map();
                data.forEach((p) => {
                    const city = p.address?.city?.trim();
                    if (!city) return;
                    const key = city.toLowerCase();
                    const img = p.images?.cover || cleanUrl(p.coverImage) || cleanUrl(Array.isArray(p.propertyImages) ? p.propertyImages[0] : '');
                    const entry = byCity.get(key) || { city, state: p.address?.state || '', count: 0, img: '' };
                    entry.count += 1;
                    if (!entry.img && img) entry.img = img;
                    byCity.set(key, entry);
                });
                setDestinations([...byCity.values()].sort((a, b) => b.count - a.count).slice(0, 8));
            } catch (err) {
                console.warn('Could not load destinations', err);
            }
        })();
        return () => { alive = false; };
    }, []);

    if (destinations.length === 0) return null;

    return (
        <section className="mt-4">
            <div className="flex items-center justify-between px-5 mb-3">
                <h2 className="font-serif text-xl font-semibold text-textDark">Featured Destinations</h2>
                <button onClick={() => navigate('/search')} className="text-xs font-bold text-emerald-700">See all</button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
                {destinations.map((d) => (
                    <button
                        key={d.city}
                        onClick={() => navigate(`/search?search=${encodeURIComponent(d.city)}`)}
                        className="relative shrink-0 w-[104px] h-[132px] rounded-[20px] overflow-hidden bg-teal-800 text-left active:scale-95 transition-transform shadow-md"
                    >
                        {d.img && <img src={d.img} alt={d.city} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <div className="absolute bottom-2.5 left-3 right-2 text-white leading-tight">
                            <span className="block text-sm font-bold truncate">{d.city}</span>
                            <span className="block text-[10px] text-white/75 truncate">{d.count} {d.count === 1 ? 'stay' : 'stays'}</span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default FeaturedDestinations;
