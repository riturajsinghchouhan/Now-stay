import React from 'react';
import { Home, Search, Briefcase, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { toast } from 'react-hot-toast';

const BottomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = React.useState(true);
 
    React.useEffect(() => {
        const checkKeyboard = () => {
            const focused = document.activeElement;
            const isInputFocused = focused && (
                ['INPUT', 'TEXTAREA'].includes(focused.tagName) || 
                focused.isContentEditable ||
                focused.getAttribute('role') === 'textbox'
            );
            
            // Check if height is significantly reduced (keyboard open)
            // We compare innerHeight with screen height to be more reliable across different WebViews
            const isHeightReduced = window.innerHeight < window.screen.height * 0.75;
            
            // Visual viewport check for browsers that support it
            const isViewportSquashed = window.visualViewport ? (window.visualViewport.height < window.innerHeight * 0.9) : false;

            if (isInputFocused || isHeightReduced || isViewportSquashed) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        const viewport = window.visualViewport;
        if (viewport) {
            viewport.addEventListener('resize', checkKeyboard);
            viewport.addEventListener('scroll', checkKeyboard);
        }
        
        window.addEventListener('resize', checkKeyboard);
        window.addEventListener('focusin', checkKeyboard);
        window.addEventListener('focusout', checkKeyboard);
        
        // Polling to handle tricky WebView cases where events might not fire correctly
        const interval = setInterval(checkKeyboard, 500);

        // Initial check
        checkKeyboard();

        return () => {
            if (viewport) {
                viewport.removeEventListener('resize', checkKeyboard);
                viewport.removeEventListener('scroll', checkKeyboard);
            }
            window.removeEventListener('resize', checkKeyboard);
            window.removeEventListener('focusin', checkKeyboard);
            window.removeEventListener('focusout', checkKeyboard);
            clearInterval(interval);
        };
    }, []);

    const navItems = [
        { name: 'Home', icon: Home, route: '/' },
        { name: 'Search', icon: Search, route: '/search' },
        { name: 'Trips', icon: Briefcase, route: '/bookings' },
        { name: 'Favorites', icon: Heart, route: '/saved-places' },
        { name: 'Profile', icon: User, route: '/profile' },
    ];

    const getActiveTab = (path) => {
        if (path === '/') return 'Home';
        if (path.includes('bookings')) return 'Trips';
        if (path.includes('saved-places')) return 'Favorites';
        if (path.includes('profile')) return 'Profile';
        if (path.includes('search')) return 'Search';
        return 'Home';
    };

    const activeTab = getActiveTab(location.pathname);

    const handleNavClick = (item) => {
        navigate(item.route);
    };

    if (!isVisible) return null;

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 print:hidden">
            <div className="
        bg-[#FFFDF8]/95 backdrop-blur-2xl 
        border border-emerald-100 shadow-[0_10px_40px_-10px_rgba(43,38,32,0.25)]
        rounded-[26px]
        flex justify-between items-center 
        px-3 py-3
      ">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;

                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item)}
                            className="relative flex flex-col items-center justify-center w-full gap-1 p-1"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-x-2 inset-y-0 bg-emerald-100/70 rounded-2xl -z-10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <Icon
                                size={21}
                                className={`transition-colors duration-200 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span className={`text-[9px] font-bold tracking-wide transition-colors duration-200 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavbar;
