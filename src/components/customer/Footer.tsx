import React from "react";
import Image from "next/image";
import { Phone, MapPin, Truck, AlertCircle } from "lucide-react";

export function CustomerFooter() {
  return (
    <footer className="bg-amber-950 text-amber-100/90 pt-10 pb-16 px-4 border-t border-amber-900/50 mt-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Banner / Restaurant Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-amber-900/40">
          {/* Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden bg-white/5">
                <Image
                  src="/images/logo.png"
                  alt="Udupi Lunch Home"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-wide font-heading">
                UDUPI LUNCH HOME
              </span>
            </div>
            <p className="text-xs text-amber-300 font-semibold tracking-wider uppercase">
              Authentic Non-Veg Coastal & Mangalorean Cuisine
            </p>
          </div>

          {/* Delivery & Call */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-xs font-bold">
              <Truck className="w-4 h-4 text-emerald-400" />
              FREE DELIVERY ON ORDERS ABOVE ₹500
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-medium">Order / Inquiries</div>
              <a
                href="tel:+918356928612"
                className="inline-flex items-center gap-2 text-base font-extrabold text-white hover:text-amber-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                +91 83569 28612
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> Address
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              New Link Road, opposite VIBGYOR School Road, Colony No 1, Bhagat Singh II, Goregaon West, Mumbai.
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-amber-900/30 rounded-2xl p-4 border border-amber-800/40 space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Important Information & Terms
          </div>
          <ul className="text-xs text-amber-200/80 space-y-1 list-disc list-inside">
            <li>Additional papad, extra chicken pieces, additional fish, and extra rice are charged extra.</li>
            <li>Parcel charges apply on takeaway orders.</li>
            <li>Thali sharing is strictly not allowed.</li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-amber-400/60 pt-2">
          © {new Date().getFullYear()} Udupi Lunch Home, Goregaon West, Mumbai. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
