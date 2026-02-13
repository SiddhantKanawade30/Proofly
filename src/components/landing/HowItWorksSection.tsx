import { Share2, Video, MessageSquare, Layout, Heart, Code } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            How TestimonialsLo Works
          </h2>
          <p className="text-lg text-slate-600">
            Create your testimonial space, share your form link, collect customer responses, and showcase them beautifully.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Step 1 - Create Space */}
          <div className="group relative flex flex-col items-center p-6 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Layout className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">
              Create Your Space
            </h3>
            <p className="text-slate-600 leading-relaxed text-center">
              Create a seperate space for your project / product / other 
            </p>
          </div>

          {/* Step 2 - Share Form */}
          <div className="group relative flex flex-col items-center p-6 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Share2 className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">
              Share Form Link
            </h3>
            <p className="text-slate-600 leading-relaxed text-center">
              Send form link to your customers, users, clients
            </p>
          </div>

          {/* Step 3 - Collect Responses */}
          <div className="group relative flex flex-col items-center p-6 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">
              Collect Responses
            </h3>
            <p className="text-slate-600 leading-relaxed text-center">
              Receive text, video, and Twitter testimonials from customers
            </p>
          </div>

          {/* Step 4 - Manage & Embed */}
          <div className="group relative flex flex-col items-center p-6 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">
             Embed / Wall of Love
            </h3>
            <p className="text-slate-600 leading-relaxed text-center">
              Embed testimonials or display them on your Wall of Love
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
