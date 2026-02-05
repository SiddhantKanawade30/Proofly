"use client";
import { useEffect, useState } from "react";

type Props = {
  url: string;
};

export default function TwitterEmbed({ url }: Props) {
  const [embedHtml, setEmbedHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmbed = async () => {
      setIsLoading(true);
      setError("");
      
      try {
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
    // Wait for both embedHtml and Twitter widgets to be ready
    if (!embedHtml) return;

    const loadWidget = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load();
      } else {
        // If script hasn't loaded yet, wait a bit and try again
        setTimeout(loadWidget, 100);
      }
    };

    loadWidget();
  }, [embedHtml]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Loading tweet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div
      className="twitter-embed-container"
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
}