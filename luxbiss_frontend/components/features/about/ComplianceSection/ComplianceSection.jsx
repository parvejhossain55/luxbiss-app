import Image from "next/image";

const items = [
  {
    img: "/1c.png",
    title: "Registered Business",
    desc: "Officially registered with relevant authorities",
  },
  {
    img: "/2c.png",
    title: "Trade License",
    desc: "Valid trade license for legal operations",
  },
  {
    img: "/3c.png",
    title: "SSL Secured",
    desc: "Advanced SSL encryption for data protection",
  },
  {
    img: "/4c.png",
    title: "Secure Infrastructure",
    desc: "Robust systems for operational safety",
  },
];

export default function ComplianceSection() {
  return (
    <section className="w-full bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0B6C86] sm:text-3xl">
            Committed to Compliance &amp; Transparency
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            We ensure the highest standards of security, compliance and
            operational transparency,
            <br className="hidden sm:block" />
            providing a safe and trustworthy environment for our investors.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-xl border border-[#BFE6FF] bg-[#F4FBFF] p-6 text-center shadow-sm"
            >
              <div className="mx-auto relative h-[70px] w-[90px]">
                <Image
                  src={it.img}
                  alt={it.title}
                  fill
                  className="object-contain"
                  sizes="90px"
                />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                {it.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}