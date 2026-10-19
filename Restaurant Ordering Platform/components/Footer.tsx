import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-stone-300 pt-16 pb-12 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-forest-800 text-amberGold-400 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Dine<span className="text-amberGold-400">Desk</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              A comprehensive digital restaurant ordering, live kitchen coordination and table management platform.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-forest-900 border border-forest-800 text-[11px] font-semibold text-amberGold-300">
              CodSoft Internship Task 2
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/menu" className="hover:text-amberGold-400 transition-colors">
                  Digital Food Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-amberGold-400 transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-amberGold-400 transition-colors">
                  Shopping Cart & Checkout
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-amberGold-400 transition-colors">
                  Order Status & History
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amberGold-400 transition-colors">
                  Staff & Admin Portals
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amberGold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Monday - Thursday</p>
                  <p className="text-xs">11:30 AM – 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amberGold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Friday - Sunday</p>
                  <p className="text-xs">11:00 AM – 11:45 PM (Live Music)</p>
                </div>
              </li>
              <li className="text-xs text-amberGold-300/80 pt-1">
                Kitchen closes 30 mins before restaurant closing.
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-4">Contact & Location</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amberGold-400 mt-0.5 flex-shrink-0" />
                <span>45 Heritage Promenade, MG Road, Bengaluru, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amberGold-400 flex-shrink-0" />
                <span>+91 (80) 4123-8899</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amberGold-400 flex-shrink-0" />
                <span>concierge@dinedesk.demo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} DineDesk Bistrot. All demo rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-amberGold-400 fill-amberGold-400" /> for CodSoft Full-Stack Internship
          </p>
        </div>
      </div>
    </footer>
  );
}
