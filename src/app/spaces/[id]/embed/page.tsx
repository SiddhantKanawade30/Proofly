
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type Testimonial = {
  id: string;
  name: string;
  position: string | null;
  testimonialType: "TEXT" | "VIDEO" | "TWITTER";
  content: string | null;
  playbackId: string | null;
  rating: number;
};

type TweetEmbed = {
  html: string;
  url: string;
  author_name: string;
};

export default function SpaceEmbedPage() {
  const { id } = useParams();
  const [data, setData] = useState<Testimonial[]>([]);
  const [tweetEmbeds, setTweetEmbeds] = useState<Record<string, TweetEmbed>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/testimonials/embed/${id}`)
      .then((res) => {
        setData(res.data || []);
        
        // Fetch tweet embeds for Twitter testimonials
        const twitterTestimonials = res.data.filter((t: Testimonial) => 
          t.testimonialType === "TWITTER" && t.content
        );
        
        const embedPromises = twitterTestimonials.map(async (t: Testimonial) => {
          try {
            const embedRes = await axios.get(
              `https://publish.twitter.com/oembed?url=${encodeURIComponent(t.content!)}&maxwidth=300` 
            );
            return { id: t.id, embed: embedRes.data };
          } catch (error) {
            console.error('Failed to fetch tweet embed:', error);
            return null;
          }
        });

        Promise.all(embedPromises).then((embeds) => {
          const embedMap: Record<string, TweetEmbed> = {};
          embeds.forEach((embed) => {
            if (embed) {
              embedMap[embed.id] = embed.embed;
            }
          });
          setTweetEmbeds(embedMap);
          setLoading(false);
          
          // Re-render Twitter widgets after embeds are loaded
          setTimeout(() => {
            if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load();
            }
          }, 100);
        });
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-3">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="w-full relative">
        {/* Background Image Header */}
        <div className="relative h-38 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center px-4">What People Say</h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {data.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-fit"
          >
            {/* Rating - Only for TEXT and VIDEO */}
            {t.testimonialType !== "TWITTER" && (
              <div className="flex items-center gap-2 mb-4">
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(t.rating)}
                </div>
              </div>
            )}

            {/* Content based on type */}
            <div className="mb-4">
              {t.testimonialType === "VIDEO" && t.playbackId ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={`https://player.mux.com/${t.playbackId}`}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : t.testimonialType === "TWITTER" && t.content ? (
                <div className="twitter-embed">
                  {tweetEmbeds[t.id] ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: tweetEmbeds[t.id].html }}
                      className="max-w-full"
                    />
                  ) : (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <a 
                          href={t.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline break-all"
                        >
                          View Tweet
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : t.content ? (
                <div className="text-gray-700 text-base leading-relaxed">
                  <p className="italic">"{t.content}"</p>
                </div>
              ) : null}
            </div>

            {/* Author info - Only for TEXT and VIDEO */}
            {t.testimonialType !== "TWITTER" && (
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-base">
                    {t.name}
                  </div>
                  {t.position && (
                    <div className="text-sm text-gray-500 mt-1">
                      {t.position}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No testimonials yet.
        </div>
      )}
    </div>
  );
}
