
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type Testimonial = {
  id: string;
  name: string;
  position: string | null;
  testimonialType: "TEXT" | "VIDEO" | "TWITTER" | "INSTAGRAM";
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
      document.body.removeChild(script);
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
        });
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-3">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-3 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {data.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3"
          >
            {/* Rating */}
            <div className="text-yellow-400 text-sm">
              {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
            </div>

            {/* Content based on type */}
            <div className="flex-1">
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
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
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
              ) : t.testimonialType === "INSTAGRAM" && t.content ? (
                <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                    <div className="flex-1">
                      <a 
                        href={t.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800 text-sm underline break-all"
                      >
                        View Instagram Post
                      </a>
                    </div>
                  </div>
                </div>
              ) : t.content ? (
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "{t.content}"
                </p>
              ) : null}
            </div>

            {/* Author info */}
            <div className="border-t pt-3 mt-auto">
              <div className="font-semibold text-gray-900 text-sm">
                {t.name}
              </div>
              {t.position && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {t.position}
                </div>
              )}
            </div>
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
