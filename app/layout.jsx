"use client";
import "../stlyes/globals.css";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useRef } from "react";

export default function RootLayout({ children }) {
  const connectionToastId = useRef(null);
  const pingEndpoint = () => {
    if (!navigator.onLine) {
      if (!connectionToastId.current) {
        connectionToastId.current = toast.error("No internet connection", {
          duration: Infinity,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } else {
      if (connectionToastId.current) {
        toast.dismiss(connectionToastId.current);
        connectionToastId.current = null;
        toast.success("Connected to the internet", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    }
  };

  useEffect(() => {
    // Run the check immediately
    pingEndpoint();

    // Set up an event listener for connection changes
    const handleConnectionChange = () => pingEndpoint();

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/metaIcons/tab_icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Honesty Store</title>
        <meta
          name="description"
          content="Get the best prices on the products!"
        />

        {/* Open Graph Metadata */}
        <meta property="og:title" content="Honesty Store" />
        <meta
          property="og:description"
          content="The best store with the best prices!"
        />
        <meta
          property="og:image"
          content="https://honesty-store.vercel.app/metaIcons/open_graph_icon.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:url" content="https://honesty-store.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Honesty Store" />
        <meta
          name="twitter:description"
          content="The best store with the best prices!"
        />
        <meta
          name="twitter:image"
          content="https://honesty-store.vercel.app/metaIcons/open_graph_icon.png"
        />
      </head>
      <body className="bg-backgroundMain">
        <div>
          <Toaster reverseOrder={false} />
        </div>
        {children}
      </body>
    </html>
  );
}
