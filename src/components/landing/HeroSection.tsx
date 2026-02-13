import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      {/* Background Image */}
      <div><br /><br /><br /><br /><br /></div>
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/doddle.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >

        <div className="absolute inset-0 bg-white/60"></div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bottom-20">
        <div className="text-center">
          <h2 className="text-4xl hover:text-primary font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6 leading-[1.1]">
            Testimonials Lo <br />
            <span className="text-primary">Without any Friction</span>
          </h2>
          <p className="text-xl leading-relaxed text-slate-600 mb-12 max-w-3xl mx-auto">
          The all-in-one platform for video and text social proof that builds trust instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
            <button className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5">
              Create your testimonial page
            </button>
            </Link>
              <button className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900">
                
                Sign in    
              </button>
          </div>
        </div>
      </div>
    </section>
  );
}
