import React, { useState } from 'react';
import HeroSection from '../../components/user/HeroSection';
import ExclusiveOffers from '../../components/user/ExclusiveOffers';
import PropertyTypeFilter from '../../components/user/PropertyTypeFilter';
import PropertyFeed from '../../components/user/PropertyFeed';
import FeaturedDestinations from '../../components/user/FeaturedDestinations';

const Home = () => {
    const [selectedType, setSelectedType] = useState('All');

    return (
        <main className="min-h-screen bg-background pb-24">
            <HeroSection />

            <div className="mt-3">
                <PropertyTypeFilter
                    selectedType={selectedType}
                    onSelectType={setSelectedType}
                />
            </div>

            <ExclusiveOffers />

            <FeaturedDestinations />

            <div className="mt-5 max-w-7xl mx-auto">
                <h2 className="font-serif text-xl font-semibold text-textDark px-5 mb-3">Inspired for you</h2>
                <PropertyFeed selectedType={selectedType} />
            </div>
        </main>
    );
};

export default Home;
