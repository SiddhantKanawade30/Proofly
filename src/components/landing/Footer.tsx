import { MessageSquare, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">
              TestimonialsLo
            </span>
          </div>

          <div className="flex items-center gap-6">
           <p className="text-sm text-slate-600">
            Crafted with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://siddhantkanawade.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
            >
              Siddhant A Kanawade
            </a>
          </p>
          </div>
          
           <a 
              href="https://github.com/SiddhantKanawade30/testimonialslo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors hover:underline"
            >
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Github  
              </div>
            </a>
            
        </div>
      </div>
    </footer>
  );
}