import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
           
            <span className="text-lg hover:text-primary-hover font-bold tracking-tight text-slate-900">
              TestimonialsLo
            </span>
          </div>
        </Link>
       
        <div className="flex items-center gap-4">
          <Link
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
            href="/signin"
          >
            Signin
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
