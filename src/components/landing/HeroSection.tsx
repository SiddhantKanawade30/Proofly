export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-16 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-2xl lg:w-1/2">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
              New: Video testimonials support
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6 leading-[1.1]">
              Collect authentic customer testimonials —{" "}
              <span className="text-primary">without friction</span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-600 mb-8 max-w-lg">
              The all-in-one platform for video and text social proof.
              Manage everything from a single dashboard to build trust
              instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5">
                Create your testimonial page
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900">
                <span
                  className="material-symbols-outlined mr-2 text-slate-500"
                  style={{ fontSize: "20px" }}
                >
                  play_circle
                </span>
                View demo
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div
                  className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 bg-cover bg-center"
                  data-alt="User avatar 1"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuA_hxu8gsKrgYpBK5h4ktzgYUgVVvWHighPM1Ft9hEwPVkBn3cqBkNm7rwPl81SOEFMwJILQLZyYuLROaPqVI0p-xMBsB0z6K0I6iXmlQhMyAF8FiZMx0Lelv_G13BoG-axqolZy1hjH3_xgkd31oIqZcvV5vrguIo_B6GL4Yzcgo9IwUamZgrD8hLW0eCxX6EaNEirrnguc69IlguaP4PjwHWqVvoTt5F_o7j8VeBTf3rvjOVWwDb7YrxMjTKqKhr_xZ2Idf_ba0g)",
                  }}
                ></div>
                <div
                  className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 bg-cover bg-center"
                  data-alt="User avatar 2"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuA8f_te7tiWTzcBG08BBuYXbqrzWwF0I0HuigfwsibGQTj7W0MGM7sUK26bYXCRv5Xx0BS8EiG-1fwDOXjzlVg7XnU7HeMeDsjfPgb_fNBIBV80aHiH46bPDThJQpf0XkW5ZNXHVdPXRfF2QcusKJlDO0sh-f8YW2qZXodBbJ-Cs4ygXUtn7grlIEp_BTkOTkQk4pbsTuYTg8-hoB2OWRigrL_n1ahqYo_p6QZEyvmCzOXDVTC-b3b6BBvG3HKi2i3WhPBPlBnNEwQ)",
                  }}
                ></div>
                <div
                  className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-400 bg-cover bg-center"
                  data-alt="User avatar 3"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBQpudXc1l8RTEYk7fY51g5KttUjZdT0y3K6nmEdByXfgEpG3Ac7YJpNOWA0ukJ8TqD0ZVLjPlZOFQ3ygxNJZaJz4qSRgmj16UBMzujqS7p-Wgj90TyRRBJ5U42LPD08cQ3dKjbGt3qo-sIgkOueCTYq77TjlwXhcvTlv6fxy_1wHeme5OjaX4THjlQ0Dg5ZPuRRcymKWMGjAUEWfi1Vp3j_lxC2Jd_5W34G0sdm2Mt6eOCTQz8c3EbqxdDkSF9IdbhhhkAs0RTTPo)",
                  }}
                ></div>
              </div>
              <p>Trusted by 1,000+ companies</p>
            </div>
          </div>
          <div className="mt-16 lg:mt-0 lg:w-1/2">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/50">
              <div className="absolute -top-12 -right-12 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 -z-10 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl"></div>
              <div className="overflow-hidden rounded-xl bg-slate-50 aspect-4/3 relative group">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  data-alt="SaaS dashboard interface mockup showing testimonial cards and video players"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCTePLPq2vrV-0-iG0THMo-c0_SmeKEAEFs_bCUJXz71XL5QOfIxzSbGwJme83Iwf4xECM-G5EtTrFnKyrhGZWlxvdu3n0bD80_gANlRHepJHpVsIn6JLkIUtrTeiGcXZEPsuO7n_oWSlnbSWPNVCjVmB7Sg8H6--kcUj53_i0ds4g7PsZY7VzGL_4FYv29Hc6M1dnywiVZ8O7_fDrByAG4Bufwx_6ZmF9K3EXt6CkHQB0DaNCcJMKyQ9KI6dlsQDrrw9Uq1Nn4mAM)",
                  }}
                ></div>
                {/* <!-- Overlay UI Elements simulation --> */}
                <div className="absolute top-4 left-4 right-4 flex gap-3">
                  <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
