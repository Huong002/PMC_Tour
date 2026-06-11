'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { tourService } from '../../../services/tour.service';
import { registrationService } from '../../../services/registration.service';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../../components/layout/Navbar';

const MOCK_TOURS: Record<number, any> = {
  1: {
    id: 1,
    title: 'Khám phá Vịnh Hạ Long',
    location: 'Quảng Ninh, Việt Nam',
    price: 499,
    description: 'Embark on a journey through the emerald waters of Ha Long Bay, a UNESCO World Heritage site known for its thousands of towering limestone karsts and isles. Our luxury cruise offers a perfect blend of adventure and relaxation. You\'ll explore hidden caves, kayak through serene lagoons, and enjoy world-class dining on the deck while watching the sunset over the horizon. This curated 5-day experience is designed for travelers who seek both the thrill of discovery and the comfort of high-end hospitality.',
    duration: '5 Days 4 Nights',
    maxParticipants: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnkKOq8bpCkA4g-NqpHUVmalVLBqmHh54K-4tD-wOm9boN4YfzqpKD8pViy16eesF7PwqJo74bUWg99vNAUxVDG9LENaJYpXlCXIlOLVkbm5hJqMeTSYSTlr12dapfq2jcx2a-0gs_8Vnrr7PnW2jYt49WSGczMyZUK5oTTV3xMz31457QrXDyvSFo2-98IJEC5QWpczPfJffe1IiLCEv_nfo7ASPce3kx9KFRKZzUVCRaWPPigB8KChwc6SKg8NOdhFCDbkhFZXU',
    itinerary: [
      { day: 1, title: 'Day 1: Arrival & Welcome Cruise', desc: 'Pickup from Hanoi Old Quarter and transfer to Ha Long Bay. Check-in on our luxury junk boat and enjoy a welcome lunch while cruising into the bay.' },
      { day: 2, title: 'Day 2: Cave Exploration & Kayaking', desc: 'Morning visit to Sung Sot Cave (Surprise Cave), the largest in the bay. Afternoon kayaking at Luon Cave or swimming at Ti Top Island beach.' },
      { day: 3, title: 'Day 3: Floating Villages & Pearl Farms', desc: 'Visit a local floating village to learn about the traditional life of fishermen. Explore a pearl farm and learn about the local oyster industry.' }
    ]
  },
  2: {
    id: 2,
    title: 'Da Nang Coastal Escape',
    location: 'Đà Nẵng, Việt Nam',
    price: 299,
    description: 'Visit the Golden Bridge and relax on the pristine beaches of central Vietnam\'s coast. This 3-day trip combines heritage visits with coastal relaxation. Walk the ancient streets of Hoi An at night, climb the Marble Mountains, and feel the sea breeze on My Khe beach.',
    duration: '3 Days 2 Nights',
    maxParticipants: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0-xI_5NNTewujqvo97PfB2MaNvVOOXXW1hcSaDHKMs4asSx1FOq4BxJ-u1wdMYspozCf6a1rkpZaRXX-A4v-bVhBqaC85MlHS9XStk4QKCv2j2jGRH1NOTKQftpfNXaNZrdyrzWrwvbQrzvMvlM1N_F-Fw5xgH5uytrLqx6cTFLfvh_aOl0532mFPYnUDc_T0pQXmp2lwv9CLreHZrRAXgYRqRHuXVBwpAdvSJ1nTZ5xyJBoEUuODCw1v3Gg9ouykMJIs4E17B-Q',
    itinerary: [
      { day: 1, title: 'Day 1: Arrival & Marble Mountains', desc: 'Welcome to Da Nang! Check in your beach hotel and visit the legendary Marble Mountains, exploring sacred caves and Buddhist sanctuaries.' },
      { day: 2, title: 'Day 2: Ba Na Hills & Golden Bridge', desc: 'Take the cable car to Ba Na Hills. Walk on the famous Golden Bridge held by giant stone hands and visit the French Village.' },
      { day: 3, title: 'Day 3: Hoi An Ancient Town & Departure', desc: 'Explore the lanterns and historic houses of Hoi An Ancient Town in the morning, then transfer to the airport for departure.' }
    ]
  },
  3: {
    id: 3,
    title: 'Sapa Highlands Treking',
    location: 'Lào Cai, Việt Nam',
    price: 349,
    description: 'A journey through the terraced rice fields and ethnic villages of northern Vietnam. Trek through Lao Chai and Ta Van, interact with H\'mong and Red Dao ethnic groups, and enjoy the breathtaking views of Fansipan mountain peak.',
    duration: '4 Days 3 Nights',
    maxParticipants: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZX6EEXXoSz07_jUo7zLg-TXJ5nfRVbgoO8r_jw8qOoLT_6ylUePyUDUMRX-97DPUX8SeZ7vA_KBibZfMkj_t47T81wMuFbX_gPoQ-7YT5OlxK2a4mHH_006vAbahGHvh2T_trOByovh3EenGXzZHkgC6356-6x3esfScMDP1N6BF2-4vbnWzBGi9U5nhyPeapvXspe0iwnz3nprsyt57JURn7KmDWkyZrp63gfk0ozUR0Qzyzs8mccLIpPx2WwDPChkklO5RDb4w',
    itinerary: [
      { day: 1, title: 'Day 1: Hanoi to Sapa & Cat Cat Village', desc: 'Morning limousine bus to Sapa. Trek down to Cat Cat village of the Black H\'mong tribe and watch traditional performances.' },
      { day: 2, title: 'Day 2: Muong Hoa Valley Trekking', desc: 'Full day trekking through the gorgeous terraced fields of Muong Hoa valley. Visit Lao Chai and Ta Van villages, enjoying lunch with a local family.' },
      { day: 3, title: 'Day 3: Fansipan Peak Cable Car', desc: 'Take the cable car up to the peak of Fansipan, the Roof of Indochina. Afternoon free to explore Sapa town and market.' }
    ]
  }
};

export default function TourDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const tourId = Number(id);

  const [scrolled, setScrolled] = useState(false);
  const [travelers, setTravelers] = useState(2);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Query tour details
  const { data: apiResponse, isLoading: isTourLoading } = useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => tourService.getById(tourId),
    enabled: !isNaN(tourId),
    retry: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const incrementTravelers = () => setTravelers((prev) => prev + 1);
  const decrementTravelers = () => setTravelers((prev) => (prev > 1 ? prev - 1 : 1));

  // Fallback to MOCK_TOURS
  const defaultTour = MOCK_TOURS[tourId] || MOCK_TOURS[1];
  const apiTour = apiResponse?.data;
  
  const tourDetail = {
    id: apiTour?.id ?? defaultTour.id,
    title: apiTour?.title ?? defaultTour.title,
    location: apiTour?.location ?? defaultTour.location,
    price: apiTour?.price ?? defaultTour.price,
    description: apiTour?.description ?? defaultTour.description,
    maxParticipants: apiTour?.maxParticipants ?? defaultTour.maxParticipants,
    duration: apiTour?.startDate && apiTour?.endDate 
      ? `${Math.ceil((new Date(apiTour.endDate).getTime() - new Date(apiTour.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days` 
      : defaultTour.duration,
    image: apiTour?.images?.[0]?.imageUrl ?? defaultTour.image,
    itinerary: defaultTour.itinerary
  };

  const pricePerPerson = tourDetail.price;
  const serviceFeePercent = 0.05;
  const subtotal = travelers * pricePerPerson;
  const serviceFee = subtotal * serviceFeePercent;
  const totalPrice = subtotal + serviceFee;

  const bookMutation = useMutation({
    mutationFn: () => registrationService.create({ tourId: tourDetail.id }),
    onSuccess: () => {
      setBookingStatus('success');
      setTimeout(() => {
        router.push('/registrations/my');
      }, 1500);
    },
    onError: (err: any) => {
      setBookingStatus('error');
      setErrorMessage(err?.response?.data?.message || 'Đã xảy ra lỗi khi đặt tour! Vui lòng thử lại.');
      setTimeout(() => setBookingStatus('idle'), 4000);
    }
  });

  const handleBookNow = () => {
    if (!user) {
      router.push(`/login?redirect=/tours/${tourId}`);
      return;
    }
    setBookingStatus('loading');
    bookMutation.mutate();
  };

  if (isTourLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></span>
        <p className="font-body-md text-on-surface-variant font-medium">Đang tải thông tin tour...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col justify-between">
      {/* TopNavBar - Shared Component */}
      <Navbar />

      <main className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-lg flex-grow">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden h-[400px] md:h-[600px] mb-xl shadow-custom">
          <img 
            className="w-full h-full object-cover" 
            alt={tourDetail.title} 
            src={tourDetail.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-xl">
            <div className="flex flex-wrap gap-sm mb-md">
              <span className="bg-tertiary/20 backdrop-blur-md text-tertiary-fixed font-label-sm text-label-sm px-3 py-1 rounded-full border border-tertiary-fixed/30">{tourDetail.duration}</span>
              <span className="bg-secondary/20 backdrop-blur-md text-secondary-fixed font-label-sm text-label-sm px-3 py-1 rounded-full border border-secondary-fixed/30">Luxury Experience</span>
              <span className="bg-primary-container/40 backdrop-blur-md text-white font-label-sm text-label-sm px-3 py-1 rounded-full border border-white/20">Best Seller</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold text-white mb-sm">{tourDetail.title}</h1>
            <p className="text-white/90 font-body-lg text-body-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">location_on</span>
              {tourDetail.location}
            </p>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-xl relative justify-between items-start">
          {/* Left Column: Content */}
          <div className="w-full lg:w-[64%] space-y-xl">
            {/* Overview */}
            <section className="bg-surface-container-lowest rounded-xl p-xl shadow-custom border border-outline-variant" id="overview">
              <h2 className="font-headline-md text-headline-md mb-md text-primary font-bold">Overview</h2>
              <p className="text-on-surface-variant font-body-md leading-relaxed">
                {tourDetail.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-xl">
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">schedule</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Duration</span>
                  <span className="font-label-md text-label-md font-bold">{tourDetail.duration}</span>
                </div>
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">group</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Max People</span>
                  <span className="font-label-md text-label-md font-bold">{tourDetail.maxParticipants} Travelers</span>
                </div>
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">translate</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Languages</span>
                  <span className="font-label-md text-label-md font-bold">VN / EN</span>
                </div>
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Safety</span>
                  <span className="font-label-md text-label-md font-bold">Certified</span>
                </div>
              </div>
            </section>

            {/* Detailed Itinerary */}
            <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 text-left" id="itinerary">
              <h2 className="font-headline-md text-headline-md mb-xl text-primary font-bold">Detailed Itinerary</h2>
              <div className="space-y-0 pl-xs">
                {tourDetail.itinerary.map((item: any, idx: number) => (
                  <div key={idx} className="itinerary-line relative pb-xl flex gap-lg">
                    {/* Glowing Neon Node */}
                    <div className="z-10 bg-primary/10 border border-primary neon-glow-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <span className="text-[10px] font-black text-primary">{idx + 1}</span>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-title-lg text-title-lg text-primary mb-xs font-bold">{item.title}</h3>
                      <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 text-left" id="services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                <div>
                  <h3 className="font-title-lg text-title-lg text-primary mb-md flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-tertiary">check_circle</span>
                    What's Included
                  </h3>
                  <ul className="space-y-sm text-on-surface-variant font-body-md text-sm">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> Professional English-speaking guide</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> All meals as mentioned in itinerary</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> Entrance fees & sightseeing tickets</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> Luxury cabin accommodation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg text-primary mb-md flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-error">cancel</span>
                    What's Excluded
                  </h3>
                  <ul className="space-y-sm text-on-surface-variant font-body-md text-sm">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-error text-[18px]">close</span> Personal expenses (laundry, phone)</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-error text-[18px]">close</span> Tips and gratuities</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-error text-[18px]">close</span> Travel insurance</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-error text-[18px]">close</span> International flights</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 text-left" id="reviews">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-xl gap-sm">
                <h2 className="font-headline-md text-headline-md text-primary font-bold">Traveler Reviews</h2>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-headline-md">4.9</span>
                  <div className="flex text-secondary">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <span className="text-on-surface-variant font-label-md text-xs">(124 reviews)</span>
                </div>
              </div>
              <div className="space-y-lg">
                <div className="border-b border-outline-variant/30 pb-lg">
                  <div className="flex justify-between mb-sm">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">SJ</div>
                      <div>
                        <p className="font-bold text-sm">Sarah Jenkins</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-body-md text-sm italic leading-relaxed">"An absolutely magical experience. The staff was attentive, the food was exquisite, and waking up to the limestone karsts outside my cabin window was a dream come true."</p>
                </div>
                <div className="pb-sm">
                  <button className="text-primary font-bold hover:text-secondary text-sm transition-colors">View all reviews</button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Sidebar (Booking Card) */}
          <div className="w-full lg:w-[32%] relative">
            <div className="sticky top-24 space-y-md">
              <div className="glass-panel p-xl rounded-3xl border border-white/25 shadow-glass text-left">
                <div className="mb-lg border-b border-outline-variant/30 pb-md">
                  <p className="text-on-surface-variant text-[10px] uppercase font-extrabold tracking-wider">Starting from</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-headline-lg font-black text-primary">${pricePerPerson}</span>
                    <span className="text-on-surface-variant text-xs font-semibold">/ person</span>
                  </div>
                </div>
                
                <div className="space-y-md">
                  {/* Date Picker */}
                  <div className="space-y-xs">
                    <label className="text-primary font-bold text-xs uppercase tracking-wider block">Departure Date</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface/50 border border-outline-variant/60 rounded-2xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold" 
                        type="date" 
                        defaultValue="2026-10-12"
                      />
                    </div>
                  </div>

                  {/* Travelers Selector */}
                  <div className="space-y-xs">
                    <label className="text-primary font-bold text-xs uppercase tracking-wider block">Travelers</label>
                    <div className="flex items-center justify-between bg-surface/50 border border-outline-variant/60 rounded-2xl p-1.5">
                      <button 
                        className="w-9 h-9 flex items-center justify-center hover:bg-surface-variant rounded-xl text-primary active:scale-90 transition-transform font-black text-lg" 
                        onClick={decrementTravelers} 
                        type="button"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-on-surface">{travelers}</span>
                      <button 
                        className="w-9 h-9 flex items-center justify-center hover:bg-surface-variant rounded-xl text-primary active:scale-90 transition-transform font-black text-lg" 
                        onClick={incrementTravelers} 
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="bg-primary/5 rounded-2xl p-md space-y-sm text-sm">
                    <div className="flex justify-between text-on-surface-variant font-medium">
                      <span>${pricePerPerson} x {travelers} travelers</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant font-medium">
                      <span>Service Fee (5%)</span>
                      <span>${serviceFee}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-primary/10 pt-sm mt-xs">
                      <span className="font-bold text-on-surface">Total Price</span>
                      <span className="text-headline-md font-black text-primary">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {bookingStatus === 'error' && (
                    <div className="p-sm bg-error/10 border border-error/20 text-error rounded-xl text-xs font-semibold text-center neon-glow-error">
                      {errorMessage}
                    </div>
                  )}

                  {/* High Quality 8-State Booking Button */}
                  <button 
                    onClick={handleBookNow}
                    disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
                    className={`w-full font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:scale-95 transition-bounce flex items-center justify-center gap-2 text-white ${
                      bookingStatus === 'success' 
                        ? 'bg-tertiary neon-glow-tertiary' 
                        : bookingStatus === 'error'
                        ? 'bg-error neon-glow-error'
                        : 'bg-secondary hover:bg-secondary-container shadow-natural'
                    }`} 
                    type="button"
                  >
                    {bookingStatus === 'loading' ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        <span>Đang đặt tour...</span>
                      </>
                    ) : bookingStatus === 'success' ? (
                      <>
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Đặt thành công!</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">bolt</span>
                        <span>Book Now</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-on-surface-variant text-[10px] italic">No payment charged yet</p>
                </div>

                <div className="mt-lg pt-lg border-t border-outline-variant/30 flex flex-col gap-md">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">verified</span>
                    <span className="font-label-md text-on-surface-variant text-sm font-medium">Free cancellation up to 48h</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">headset_mic</span>
                    <span className="font-label-md text-on-surface-variant text-sm font-medium">24/7 Support available</span>
                  </div>
                </div>
              </div>

              {/* Contact Expert Card */}
              <div className="bg-primary-container text-on-primary-container p-lg rounded-3xl flex items-center justify-between text-left">
                <div>
                  <p className="font-bold text-white text-sm">Need help booking?</p>
                  <p className="text-xs text-white/80">Talk to our local expert</p>
                </div>
                <button className="bg-white/20 hover:bg-white/30 p-2.5 rounded-full transition-bounce text-white active:scale-95">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours Section */}
        <section className="mt-xl pt-xl border-t border-outline-variant mb-xl text-left">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Related Adventures</h2>
              <p className="text-on-surface-variant font-body-md">Tours that other travelers also enjoyed</p>
            </div>
            <Link href="/tours" className="text-primary font-bold flex items-center gap-1 hover:underline active:scale-95 transition-transform">
              View All
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {/* Related Tour 1 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-custom border border-outline-variant transition-transform hover:-translate-y-2 duration-300">
              <div className="h-48 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="Hà Giang Loop" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw31B29BQiu-WFQ75W9Fo34Fq6que1RDarubVXF7ClsszWHZWckQmq1_T-wtoROox-5EePZpboEncve7Ldvvu2OCcI9VieJIVhKWGIpwAl_L4Szc13wnwT7-ZjZdMnwUO6oqAl8KxXjHmk8qMgfyDz9Aoe1akFO36SbSezra_ndj-R-NQIA2xjd2WlVlxhdaI3WxuZ97GZbTWhk_Chr9sD60qXpn8VeiOYez5-3nMG3-ZMNT5_2w8_KIwC0OqvYIyizGV5hRhc3BQ"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-bold text-[12px]">HÀ GIANG</div>
              </div>
              <div className="p-md">
                <h3 className="font-title-lg text-title-lg mb-xs group-hover:text-primary transition-colors font-semibold">Hà Giang Loop Adventure</h3>
                <div className="flex items-center gap-1 text-secondary-container mb-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-xs text-on-surface">4.8</span>
                  <span className="text-xs text-on-surface-variant ml-1">(92 reviews)</span>
                </div>
                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <span className="font-label-md text-on-surface-variant text-sm">4 Days</span>
                  <span className="font-bold text-primary text-sm">$350</span>
                </div>
              </div>
            </div>

            {/* Related Tour 2 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-custom border border-outline-variant transition-transform hover:-translate-y-2 duration-300">
              <div className="h-48 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="Hội An ancient town" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXu2BWHLkLgKrBVdux3vw_5YWjmtOMA8TprVIALYDQNdUg8u2tvPHDBcr8wo_SnSihIhtd7ObU6XTMDljHAak2vqeJWU7m5bbmlyb5cwXNmNmfBRXAfbifWnbWBn2MBmPVhQUFsSF2iBmlcwF_yY1hhZlpqoj8ee3S1Oe8aRklPf3Xsi5s4DVZ72FSCNXmJwa1XbobWuGR4f7Z1ud0IKt28S8f7UJOAnMk2RA4amYT0mu0ReaYLiBaTF7jHh_x0j_P0y6MXGVkVwc1c"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-bold text-[12px]">HỘI AN</div>
              </div>
              <div className="p-md">
                <h3 className="font-title-lg text-title-lg mb-xs group-hover:text-primary transition-colors font-semibold">Hội An Ancient Town Culture</h3>
                <div className="flex items-center gap-1 text-secondary-container mb-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-xs text-on-surface">5.0</span>
                  <span className="text-xs text-on-surface-variant ml-1">(215 reviews)</span>
                </div>
                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <span className="font-label-md text-on-surface-variant text-sm">3 Days</span>
                  <span className="font-bold text-primary text-sm">$299</span>
                </div>
              </div>
            </div>

            {/* Related Tour 3 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-custom border border-outline-variant transition-transform hover:-translate-y-2 duration-300">
              <div className="h-48 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="Tràng An Ninh Bình" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcV9rq3xqVY9BNbREoZmXT4Ooh54folb-k0IVqD8Xa80RoMcbsvaTH1tMSaYj1smq6BOw7VCALXYeT1YRuXuZCs1YJIGeHM-W2GHsjeF4Yl0GQOBy2do1LzbeCvnpUz8TlnAcUzyY9RI_3WHARL--TB50TJYbOeJ2arHE-ybqcW2az_AL5e-OK4MJtLCh76g-GFJ1JWoRGx27mIep2bjSVMXyZ79Pq-kmo3oFBv3NV3bmHsAkff3tqRSJ_oKYJbYVRv7iHpdry_AY"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-bold text-[12px]">NINH BÌNH</div>
              </div>
              <div className="p-md">
                <h3 className="font-title-lg text-title-lg mb-xs group-hover:text-primary transition-colors font-semibold">Tràng An Boat Tour & Caves</h3>
                <div className="flex items-center gap-1 text-secondary-container mb-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-xs text-on-surface">4.7</span>
                  <span className="text-xs text-on-surface-variant ml-1">(58 reviews)</span>
                </div>
                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <span className="font-label-md text-on-surface-variant text-sm">1 Day</span>
                  <span className="font-bold text-primary text-sm">$120</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-surface-container-lowest text-white dark:text-primary full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto text-left">
          <div className="col-span-1 md:col-span-1">
            <span className="font-headline-md text-headline-md text-surface-bright font-bold mb-md block">VietTour</span>
            <p className="font-body-md text-surface-variant dark:text-on-surface-variant leading-relaxed text-sm">
              Professional, Inviting, and Dynamic travel experiences across Vietnam's most beautiful landscapes.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-md font-label-md text-sm">Company</h4>
            <ul className="space-y-sm text-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/about">About Us</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/contact">Contact</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/tours">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-md font-label-md text-sm">Legal</h4>
            <ul className="space-y-sm text-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/tours">Terms of Service</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/tours">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-md font-label-md text-sm">Newsletter</h4>
            <p className="text-surface-variant dark:text-on-surface-variant font-label-sm mb-md text-sm">Get travel updates and deals.</p>
            <div className="flex gap-2">
              <input 
                className="bg-surface/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-secondary" 
                placeholder="Email" 
                type="email"
              />
              <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">Join</button>
            </div>
          </div>
        </div>
        <div className="px-margin-desktop py-md border-t border-white/10 w-full max-w-max-width mx-auto">
          <p className="font-label-sm text-label-sm text-surface-variant text-center text-xs">© 2024 VietTour. All rights reserved. Professional, Inviting, and Dynamic travel experiences.</p>
        </div>
      </footer>
    </div>
  );
}
