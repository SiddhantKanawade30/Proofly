"use client";
import { useEffect, useState } from "react";

type Props = {
  url: string;
};

export default function TwitterEmbed({ url }: Props) {
  const [embedHtml, setEmbedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEmbed = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        // Use Twitter's oEmbed API
        const response = await fetch(
          `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&dnt=true`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch tweet");
        }
        
        const data = await response.json();
        setEmbedHtml(data.html);
      } catch (err) {
        console.error("Error loading tweet:", err);
        setError("Failed to load tweet");
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchEmbed();
    }
  }, [url]);

  useEffect(() => {
    // Load Twitter widgets after HTML is set
    if (embedHtml) {
      // @ts-ignore
      if (window.twttr?.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      } else {
        // If widgets not loaded yet, load the script
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        document.body.appendChild(script);
      }
    }
  }, [embedHtml]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full py-8">
        <div className="text-gray-400">Loading tweet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center w-full py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center w-full"
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
}