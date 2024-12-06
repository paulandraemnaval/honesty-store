import Head from "next/head";
import "../stlyes/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Honesty Store",
  description: "Get the best prices on the products!",
};

export default function RootLayout({ children }) {
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
        <meta property="og:imgage:type" content="image/png" />
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
