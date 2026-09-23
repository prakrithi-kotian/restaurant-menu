"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CustomerFooter } from "@/components/customer/Footer";
import { QrCode, ArrowRight, Sparkles, Flame, Phone, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-[10px] sm:text-[11px] font-bold py-1.5 px-2 sm:px-4 text-center flex items-center justify-center gap-1.5 sm:gap-2 border-b border-emerald-800 z-20">
        <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
        <a href="tel:+918356928612" className="hover:underline flex items-center gap-1 whitespace-nowrap">
          <span className="hidden sm:inline">Call to Order:</span>
          <span className="text-amber-300 font-mono font-extrabold">+91 83569 28612</span>
        </a>
        <span className="hidden sm:inline text-emerald-400 font-normal whitespace-nowrap">| Goregaon West, Mumbai</span>
      </div>

      {/* Decorative ambient warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-600/10 via-red-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] shrink-0 rounded-xl overflow-hidden shadow-md shadow-red-900/15 bg-white/5">
            <Image
              src="/images/logo.png"
              alt="Udupi Lunch Home"
              width={58}
              height={58}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight font-heading text-foreground uppercase leading-tight">
                UDUPI LUNCH HOME
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 shrink-0">
                NON VEG
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Goregaon West, Mumbai
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:+918356928612"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-extrabold shadow-sm transition-all whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>📞 +91 83569 28612</span>
          </a>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center text-center z-10 space-y-8">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-800/10 text-red-800 dark:text-red-300 border border-red-800/20 text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Authentic Coastal Udupi & Mangalorean Delicacies
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3 max-w-2xl flex flex-col items-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-1 rounded-2xl overflow-hidden shadow-lg shadow-amber-950/10 bg-white/5 border border-amber-900/10">
            <Image
              src="/images/logo.png"
              alt="Udupi Lunch Home"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-heading leading-tight uppercase">
            UDUPI LUNCH HOME
          </h1>
          <p className="text-base sm:text-lg text-amber-900/80 dark:text-amber-200/80 font-semibold max-w-lg mx-auto">
            Savor authentic Chicken Thali, Fish Fry, Kori Rotti, Neer Dosa & Mutton Ghee Roast prepared fresh to order.
          </p>
        </div>

        {/* Hero Image Card */}
        <div className="relative w-full max-w-xl aspect-[16/9] rounded-3xl overflow-hidden border-2 border-amber-900/20 shadow-xl shadow-amber-950/10 my-2">
          <Image
            src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80"
            alt="Udupi Lunch Home Chicken Thali & Specialities"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
            <div className="text-left text-white space-y-1">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-amber-950 uppercase tracking-wider">
                Speciality Thalis & A La Carte
              </span>
              <h3 className="text-lg font-bold">Real Mangalorean Spices & Fresh Coastal Catch</h3>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <Link
            href="/menu"
            className="w-full py-4 px-6 rounded-2xl bg-red-800 hover:bg-red-900 text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all flex items-center justify-center gap-2 group active:scale-98"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Browse Full Restaurant Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="tel:+918356928612"
            className="w-full py-3.5 px-6 rounded-2xl bg-card hover:bg-muted border border-border text-foreground font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>📞 Call to Order: +91 83569 28612</span>
          </a>
        </div>

        {/* Contact & Info Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left">
          <div className="p-3.5 rounded-2xl bg-card border border-border/70 flex items-start gap-2.5">
            <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-foreground">Signature Thalis</div>
              <div className="text-[11px] text-muted-foreground">Chicken & Fish Thali from ₹249</div>
            </div>
          </div>

          <a
            href="tel:+918356928612"
            className="p-3.5 rounded-2xl bg-card border border-border/70 flex items-start gap-2.5 hover:border-emerald-600/50 transition-colors"
          >
            <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-foreground">Phone Ordering</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+91 83569 28612</div>
            </div>
          </a>

          <div className="p-3.5 rounded-2xl bg-card border border-border/70 flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-foreground">Goregaon West</div>
              <div className="text-[11px] text-muted-foreground">Opp VIBGYOR School Rd</div>
            </div>
          </div>
        </div>
      </main>

      {/* Customer Footer */}
      <CustomerFooter />
    </div>
  );
}
