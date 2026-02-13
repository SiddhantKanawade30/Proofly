import { Rocket, Briefcase, Cloud } from "lucide-react";

export default function UseCasesSection() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Built for modern businesses
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* <!-- Card 1 --> */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Rocket className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Startups</h3>
            <p className="mt-2 text-slate-600 text-left">
              Build credibility from day one with social proof that converts early adopters.
            </p>
          </div>
          {/* <!-- Card 2 --> */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Freelancers
            </h3>
            <p className="mt-2 text-slate-600 text-left">
              Showcase client testimonials to win higher-value contracts and build reputation.
            </p>
          </div>
          {/* <!-- Card 3 --> */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <Cloud className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              SaaS Products
            </h3>
            <p className="mt-2 text-slate-600 text-left">
              Reduce churn and boost conversions with video testimonials and social proof.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
