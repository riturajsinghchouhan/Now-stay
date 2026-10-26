import React, { useState, useEffect } from 'react';
import { Search, Menu, Wallet, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NowStayLogo from '../ui/NowStayLogo';
import MobileMenu from '../../components/ui/MobileMenu';
import { useNavigate } from 'react-router-dom';
import walletService from '../../services/walletService';
import HomeSearchModal from '../../components/modals/HomeSearchModal';
import { api } from '../../services/apiService';

const HeroSection = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [appLinks, setAppLinks] = useState([]);
    const [selectedAppModal, setSelectedAppModal] = useState(null);

    const placeholders = [
        "Search in Bucharest...",
        "Find luxury hotels...",
        "Book villas in Bali...",
        "Couple friendly stays...",
        "Search near Red Square..."
    ];

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    const walletData = await walletService.getWallet();
                    if (walletData.success && walletData.wallet) {
                        setWalletBalance(walletData.wallet.balance);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch wallet', error);
            }
        };

        const fetchAppLinks = async () => {
            try {
                const res = await api.get('/app-links');
                if (res.data && res.data.success) {
                    setAppLinks(res.data.appLinks || []);
                }
            } catch (error) {
                console.error('Failed to fetch app links', error);
            }
        };

        fetchWallet();
        fetchAppLinks();
    }, []);

    // Scroll Listener for Sticky & Header Logic
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsSticky(scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
    };

    return (
        <section className="relative w-full">

            {/* Hero image with logo row, headline and floating search */}
            <div className="relative h-[330px] md:h-[420px] overflow-hidden rounded-b-[36px] bg-[#2B2620]">
                <img
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />

                <div className="relative z-10 flex items-center justify-between px-5 pt-5 md:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center active:scale-95 transition"
                        >
                            <Menu size={18} className="text-white" />
                        </button>
                        <NowStayLogo size="md" inverted />
                    </div>
                    <button
                        onClick={() => navigate('/wallet')}
                        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 active:scale-95 transition"
                    >
                        <span className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
                            <Wallet size={13} className="text-white" />
                        </span>
                        <span className="text-xs font-bold text-white">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(walletBalance)}
                        </span>
                    </button>
                </div>

                <div className="relative z-10 px-6 md:px-12 mt-10 md:mt-16 max-w-3xl">
                    <h1 className="font-serif text-[34px] md:text-6xl leading-[1.1] font-medium text-white">
                        Discover stays<br />that stay with you
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-white/80 max-w-xs md:max-w-md">
                        Curated stays for every kind of traveler, from villas to homestays.
                    </p>
                </div>
            </div>

            {/* Floating search pill (sticks to top on scroll) */}
            <div className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-background/95 backdrop-blur-xl shadow-md' : 'relative z-20 px-5 -mt-8'} transition-all duration-300 flex justify-center`}>
                <button
                    onClick={handleSearchClick}
                    className="w-full max-w-xl bg-white rounded-full shadow-[0_12px_30px_-10px_rgba(43,38,32,0.35)] border border-emerald-100 flex items-center gap-3 pl-5 pr-2 py-2 text-left active:scale-[0.98] transition"
                >
                    <MapPin size={20} className="text-textDark shrink-0" />
                    <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-textDark leading-tight">Where to next?</span>
                        <span className="block text-xs text-slate-500 truncate">Anywhere &middot; Any week &middot; Add guests</span>
                    </span>
                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shrink-0 shadow-md">
                        <Search size={18} className="text-white" />
                    </span>
                </button>
            </div>
            {isSticky && <div className="h-6" />}

            {/* App links */}
            {appLinks.length > 0 && (
                <div className="w-full flex gap-4 overflow-x-auto no-scrollbar px-5 pt-5 flex-nowrap">
                    {appLinks.map((app) => (
                        <button
                            key={app._id}
                            onClick={() => setSelectedAppModal(app)}
                            className="flex flex-col items-center gap-1 shrink-0 active:scale-95 transition"
                            title={`Download ${app.name}`}
                        >
                            <div className="w-14 h-14 rounded-[22%] overflow-hidden shadow-md border border-emerald-100 bg-white">
                                <img
                                    src={app.logo}
                                    alt={app.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80?text=App'; }}
                                />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight max-w-[80px]">{app.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* App Download Store Selector Popup Modal */}
            {selectedAppModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 text-center animate-scaleUp">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedAppModal(null)}
                            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                        >
                            <X size={20} />
                        </button>

                        {/* App Header */}
                        <div className="flex flex-col items-center justify-center mb-6 pt-2">
                            <img
                                src={selectedAppModal.logo}
                                alt={selectedAppModal.name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100 shadow-md mb-3"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/80?text=App';
                                }}
                            />
                            <h3 className="text-xl font-black text-gray-900 leading-tight">
                                {selectedAppModal.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                                Choose your store to download the mobile app
                            </p>
                        </div>

                        {/* Store Choice Buttons matching Image 2 */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                            {/* Google Play Store */}
                            {selectedAppModal.playStoreUrl ? (
                                <a
                                    href={selectedAppModal.playStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setSelectedAppModal(null)}
                                    className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2B2620] hover:bg-[#3A332A] border border-gray-800 text-white shadow-md hover:shadow-lg active:scale-95 transition-all group"
                                >
                                    <img
                                        src="/WhatsApp_Image_2026-05-09_at_1.50.21_PM-removebg-preview.png"
                                        alt="Google Play"
                                        className="w-5 h-5 object-contain transition-transform group-hover:scale-110 shrink-0"
                                    />
                                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#B8893C] whitespace-nowrap">
                                        Google Play
                                    </span>
                                </a>
                            ) : (
                                <div className="flex-1 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-400 font-medium text-center">
                                    Google Play unavailable
                                </div>
                            )}

                            {/* Apple App Store */}
                            {selectedAppModal.appStoreUrl ? (
                                <a
                                    href={selectedAppModal.appStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setSelectedAppModal(null)}
                                    className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2B2620] hover:bg-[#3A332A] border border-gray-800 text-white shadow-md hover:shadow-lg active:scale-95 transition-all group"
                                >
                                    <img
                                        src="/WhatsApp_Image_2026-05-11_at_12.14.22_PM-removebg-preview.png"
                                        alt="App Store"
                                        className="w-5 h-5 object-contain transition-transform group-hover:scale-110 shrink-0"
                                    />
                                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#B8893C] whitespace-nowrap">
                                        App Store
                                    </span>
                                </a>
                            ) : (
                                <div className="flex-1 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-400 font-medium text-center">
                                    App Store unavailable
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            
            <HomeSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        </section>
    );
};

export default HeroSection;
