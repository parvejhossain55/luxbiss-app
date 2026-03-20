import Image from "next/image";

export default function OurStorySection() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-center text-3xl font-extrabold text-[#0B6C86]">
          Our Story
        </h2>

        {/* Top content */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Left text */}
          <div className="text-slate-700">
            <p className="max-w-lg text-sm leading-6">
              Our Platform was created to solve a common
              <br />
              problem — many people want to start a business
              <br />
              but lack infrastructure, logistics and operational
              <br />
              expertise.
            </p>

            <p className="mt-6 max-w-lg text-sm leading-6">
              We built a structured system that connects product
              <br />
              sourcing, marketing, sales and investor
              <br />
              participation into one streamlined model.
            </p>
          </div>

          {/* Right oval image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-[220px] w-full max-w-[420px] overflow-hidden rounded-[999px] bg-slate-100 shadow-sm">
              <Image
                src="/story.jpg"     // put story.jpg in /public
                alt="Our Story illustration"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 420px, 100vw"
              />
              {/* subtle highlight like the screenshot */}
              <div className="absolute inset-0 bg-white/10" />
            </div>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Mission card */}
          <div className="flex gap-4 rounded-xl bg-[#F4FBFF] p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DFF3FF]">
              {/* simple mission icon (inline SVG) */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 14.5c2.5 0 4.5-2 4.5-4.5S6.5 5.5 4 5.5"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M20 9.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8.5 10h7"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 20l2-2 2 2"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
              <p className="mt-1 text-sm text-slate-700">
                To make structured product-based
                <br />
                investment accessible and transparent.
              </p>
            </div>
          </div>

          {/* Core values card */}
          <div className="flex gap-4 rounded-xl bg-[#F4FBFF] p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DFF3FF]">
              {/* simple values icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 3h10v4H7V3Z"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 7h12v14H6V7Z"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11h6M9 15h6"
                  stroke="#0B6C86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="w-full">
              <h3 className="text-base font-bold text-slate-900">
                Our Core Values
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-y-2 text-sm text-slate-700 sm:grid-cols-2 sm:gap-x-6">
                <ValueItem text="Transparency" />
                <ValueItem text="Professional Operations" />
                <ValueItem text="Accountability" />
                <ValueItem text="Long-Term Sustainability" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueItem({ text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      <span>{text}</span>
    </div>
  );
}