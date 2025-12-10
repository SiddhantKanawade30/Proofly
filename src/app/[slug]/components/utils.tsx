import {CheckCircle2, MessageSquare, Star, Video} from "lucide-react"

export const Loader = () => {
    return (
        <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
}

export const SubmitedForm = ({setSubmitted, campaign}:{setSubmitted : any, campaign : any}) =>{
    return(
        <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-xl border shadow-sm flex flex-col gap-6 p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <CheckCircle2 className="h-10 w-10 text-gray-900" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Your feedback has been submitted successfully. We appreciate your input for {campaign.title}.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
} 

export const NotCampaign = () => {
    return(
        <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-xl border shadow-sm p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Campaign Not Found</h1>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    )
}

export const Footer = () =>{
    return (
        <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-medium text-foreground">Testimonials</span>
        </p>
      </div>
    )
}

export const ToggleButton = ({testimonialType ,setTestimonialType}:{testimonialType:any ,setTestimonialType:any}) =>{
    return(
        <div className="px-6 flex-shrink-0">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 w-full max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setTestimonialType('text')}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  testimonialType === 'text'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Text
              </button>
              <button
                type="button"
                onClick={() => setTestimonialType('video')}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  testimonialType === 'video'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Video className="h-4 w-4" />
                Video
              </button>
            </div>
          </div>
    )
}

export const HeaderSection = ({campaign}:{campaign:any}) =>{
    return(
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            
          </div>
          
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Experience
            </h1>
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded px-3 py-1">
                <Star className="h-3 w-3 text-gray-900 fill-gray-900" />
                <span className="text-xs font-medium text-gray-900">This is a feedback form for: {campaign.title}</span>
              </div>
              {campaign.website && (
                <a 
                  href={campaign.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Visit website to checkout the product →
                </a>
              )}
            </div>
          </div>
        </div>
    )
}


export const InputStyle = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pl-10 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"