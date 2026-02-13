export default function DashboardPreviewSection() {
  return (
    <section className="py-20 bg-background-offset border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to <br className="hidden lg:block" />
              manage social proof.
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1 text-primary">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Beautiful Testimonial Cards
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Display testimonials in responsive cards with ratings and author info
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 text-primary">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Video & Text Support
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Support both video and text testimonials with Twitter import
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 text-primary">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Wall of Love
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Create stunning testimonial walls to build social proof
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 text-primary">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Import from X
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Import testimonials directly from X (Twitter) to your space
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
              {/* MacOS Window Header */}
              <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 px-4 py-2.5 flex gap-2 items-center">
                {/* Traffic Light Buttons */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors shadow-sm"></div>
                </div>

                {/* URL Bar */}
                <div className="flex-1 flex justify-center px-4">
                  <div className="bg-white border border-slate-200 text-xs text-slate-500 px-4 py-1.5 rounded-md w-full max-w-md shadow-sm flex items-center gap-2">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="font-medium">testimonialslo.vercel.app</span>
                  </div>
                </div>

                {/* Right Side Spacer */}
                <div className="w-15"></div>
              </div>

              {/* Screen Content Area */}
              <div className="aspect-video bg-slate-50 w-full relative">
                {/* Inner padding for content */}
                <div className="absolute inset-0 p-4">
                  <div
                    className="w-full h-full bg-cover bg-center rounded-lg shadow-inner"
                    data-alt="TestimonialsLo dashboard interface with testimonial management and Wall of Love preview"
                    style={{
                      backgroundImage: "url(/wall-of-love.png)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
