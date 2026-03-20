import Image from "next/image";
import Link from "next/link";

export default function HeroInvestment({
  titleLine1 = "Building Opportunities Through",
  titleLine2 = "Structured Investment",
  description = `We create a business ecosystem where individuals
can participate in real product-base commerce
without managing operations.`,
  primaryHref = "/opportunities",
  primaryText = "Explore Opportunities",
  secondaryHref = "/login",
  secondaryText = "Login",
}) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/about.png"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Optional soft overlay */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full md:max-w-[520px]">
            <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-[#0B6C86] sm:text-[36px] md:text-[44px]">
              {titleLine1}
              <br />
              {titleLine2}
            </h1>

            <p className="mt-5 max-w-md whitespace-pre-line text-sm leading-6 text-slate-700/90">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-full bg-[#0B6C86] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-95"
              >
                {primaryText}
              </Link>

              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-[#0B6C86]/40 bg-white/60 px-7 py-3 text-sm font-semibold text-[#0B6C86] backdrop-blur-sm transition hover:bg-white/80"
              >
                {secondaryText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}