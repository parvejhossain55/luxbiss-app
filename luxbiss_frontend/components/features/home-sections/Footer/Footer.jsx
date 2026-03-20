
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#EAF6FB]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Left: Logo + Subscribe + Social */}
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <span className="text-xs font-bold text-slate-700">LB</span>
              </div>

              <div className="text-lg font-extrabold tracking-wide text-sky-700">
                LUX <span className="text-sky-600">BISS</span>
              </div>
            </div>

            <div className="mt-6 flex w-full max-w-xs items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button className="shrink-0 bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
                Subscribe
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-extrabold text-sky-800">About LuxBiss</h4>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              Luxbiss is committed to providing home-based business and tracking
              services with modern business amenities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-sky-800">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <a className="hover:text-sky-800" href="#about">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-sky-800" href="#how-it-works">
                  How it works
                </a>
              </li>
              <li>
                <a className="hover:text-sky-800" href="#products">
                  Our Products
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-sm font-extrabold text-sky-800">
              Contact &amp; Location
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-700" />
                <span>
                  Address: 123 S Clark St, Chicago,
                  <br />
                  IL 60603
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-700" />
                <span>Phone: +1 234-567 8900</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-700" />
                <span>Email: support@luxbiss.com</span>
              </div>
            </div>

            {/* Map image */}
            <div className="mt-4 h-20 w-20 overflow-hidden rounded-md bg-white ring-1 ring-slate-200">
              <Image
                src="/Location.jpg"
                alt="Location map"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-300/60 pt-4">
          <p className="text-xs text-slate-600">
            © 2026{" "}
            <a className="text-sky-700 hover:underline" href="#home">
              LuxBiss.
            </a>{" "}
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}