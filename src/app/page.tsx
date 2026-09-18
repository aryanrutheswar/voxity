'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/hero/Hero';
import { Services } from '@/components/sections/Services';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { ContactWidget } from '@/components/widgets/ContactWidget';
import { CalendlyModal } from '@/components/widgets/CalendlyModal';
import { ServiceDetailModal } from '@/components/widgets/ServiceDetailModal';
import { Service } from '@/types';

export default function Home() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenCalendly = () => setCalendlyOpen(true);

  return (
    <main className="min-h-screen relative bg-[#FFFFFF] dark:bg-[#0B0F19] text-black dark:text-slate-100 overflow-x-hidden selection:bg-[#FFE600] selection:text-black transition-colors duration-300">
      {/* Navbar */}
      <Navbar onOpenCalendly={handleOpenCalendly} />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Services Section */}
      <Services onSelectService={setSelectedService} />

      {/* 3. Contact Details Section */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Conversion Widgets & Modals */}
      <ContactWidget />
      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onOpenCalendly={handleOpenCalendly}
      />
    </main>
  );
}
