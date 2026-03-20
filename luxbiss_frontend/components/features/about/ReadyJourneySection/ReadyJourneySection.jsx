import Image from "next/image";
import Link from "next/link";

export default function ReadyJourneySection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/ab.png"
          alt="Ready to Start Your Business Journey"
          fill
          priority
          className="object-cover object-[70%_center]"
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="h-[320px] sm:h-[360px] md:h-[400px] flex items-start pt-14">
          <div className="max-w-xl">
            <h2 className="text-[28px] font-extrabold leading-tight text-[#0B6C86] sm:text-[34px] md:text-[40px]">
              Ready to Start Your Business Journey?
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-700/90">
              Join us today and take the first step towards business ownership
              and success
              <br />
              with our full-support platform.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/get-started"
                className="rounded-full bg-[#0B6C86] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-95"
              >
                Get Started
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-[#0B6C86]/40 bg-white/70 px-6 py-2.5 text-sm font-semibold text-[#0B6C86] backdrop-blur-sm transition hover:bg-white/90"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}