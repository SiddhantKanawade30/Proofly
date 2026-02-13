import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
          Start collecting testimonials you can actually trust
        </h2>
        <Link href="/signup">
        <div className="flex justify-center gap-4">
          <button className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105">
            Get Started for Free
          </button>
        </div>
        </Link>
      </div>
    </section>
  );
}
