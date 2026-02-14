"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, useAnimationControls } from "motion/react";

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
        const twitterTestimonials = res.data.filter(
          (t: Testimonial) => t.testimonialType === "TWITTER" && t.content
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

          setTimeout(() => {
            if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load();
            }
          }, 100);
        });
      })
      .catch(() => setLoading(false));
  }, [id]);

  const distributeTestimonials = (testimonials: Testimonial[], columns: number) => {
    const cols: Testimonial[][] = Array.from({ length: columns }, () => []);
    testimonials.forEach((t, i) => {
      cols[i % columns].push(t);
    });
    return cols;
  };

  // Responsive column count
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) {
        setColumnCount(1);
      } else if (window.innerWidth < 1280) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columns = distributeTestimonials(data, columnCount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 h-full">
        {columns.map((column, colIndex) => (
          <ScrollingColumn
            key={colIndex}
            column={column}
            isReverse={colIndex % 2 === 1}
            tweetEmbeds={tweetEmbeds}
          />
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

function ScrollingColumn({
  column,
  isReverse,
  tweetEmbeds
}: {
  column: Testimonial[];
  isReverse: boolean;
  tweetEmbeds: Record<string, TweetEmbed>;
}) {
  const controls = useAnimationControls();
  const duplicatedColumn = [...column, ...column];

  useEffect(() => {
    controls.start({
      y: isReverse ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        duration: 40,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop"
      }
    });
  }, [controls, isReverse]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        animate={controls}
        className="space-y-4 md:space-y-6"
        initial={false}
      >
        {duplicatedColumn.map((t, index) => (
          <TestimonialCard
            key={`${t.id}-${index}`}
            testimonial={t}
            tweetEmbed={tweetEmbeds[t.id]}
          />
        ))}
      </motion.div>
    </div>
  );
}

function TestimonialCard({ 
  testimonial: t, 
  tweetEmbed 
}: { 
  testimonial: Testimonial; 
  tweetEmbed?: TweetEmbed;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4 md:p-6">
        {t.testimonialType !== "TWITTER" && (
          <div className="text-yellow-400 text-lg mb-3">
            {"★".repeat(t.rating)}
          </div>
        )}

        {t.testimonialType === "VIDEO" && t.playbackId ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <iframe
              src={`https://player.mux.com/${t.playbackId}`}
              className="w-full h-full"
              style={{ border: 'none', aspectRatio: '16/9' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : t.testimonialType === "TWITTER" && t.content ? (
          <div className="twitter-embed">
            {tweetEmbed ? (
              <div
                dangerouslySetInnerHTML={{ __html: tweetEmbed.html }}
                className="max-w-full"
              />
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
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
          <div className="text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="italic">"{t.content}"</p>
          </div>
        ) : null}
      </div>

      {t.testimonialType !== "TWITTER" && (
        <div className="border-t px-4 md:px-6 py-3 md:py-4 bg-gray-50">
          <div className="font-semibold text-gray-900 text-sm md:text-base">
            {t.name}
          </div>
          {t.position && (
            <div className="text-xs md:text-sm text-gray-500 mt-1">
              {t.position}
            </div>
          )}
        </div>
      )}
    </div>
  );
}