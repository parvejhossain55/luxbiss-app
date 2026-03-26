// app/components/HeroSection.jsx
// Full-screen hero (takes full height of the screen). Navbar NOT included.

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden isolate">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.webp" // put in /public/background.webp
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* readability overlay */}
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* Content wrapper fills the height */}
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:py-0">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left content */}
          <div className="max-w-xl">
            <h1 className="text-balance text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              <span className="text-sky-700">Start Your</span>
              <br />
              Own Business
              <br />
              With Little <span className="text-slate-900">Capital</span>
            </h1>

            <p className="mt-4 text-pretty text-sm leading-6 text-slate-700 sm:text-base">
              Without showroom, website, marketing or transport, just invest in the
              product and share the profits. We will manage the entire system.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/registration"
                className="inline-flex items-center justify-center rounded-full bg-sky-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
              >
                Start Business Now
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/90 px-6 py-2.5 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur transition hover:bg-white"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="mx-auto w-full max-w-2xl">
              {/* Optional glass frame like screenshot */}
              <div className="rounded-3xl bg-white/50 p-2 shadow-xl ring-1 ring-slate-200 backdrop-blur">

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
