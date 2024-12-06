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
      </head>
      <body className="bg-backgroundMain">
        <Head>
          {/* Basic metadata */}
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />

          {/* Open Graph metadata */}
          <meta property="og:title" content="Honesty Store" />
          <meta
            property="og:description"
            content="The best store with the best prices!"
          />
          <meta
            property="og:image"
            content="https://firebasestorage.googleapis.com/v0/b/fir-prac-3866d.appspot.com/o/undefined%2Fopen_graph_icon.png?alt=media&token=8b96e64b-0b76-4eb9-8953-251f634b71c5"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://honesty-store.vercel.app" />
          <meta property="og:type" content="website" />

          {/* Twitter Card metadata */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Honesty Store" />
          <meta
            name="twitter:description"
            content="The best store with the best prices!"
          />
          <meta
            name="twitter:image"
            content="https://firebasestorage.googleapis.com/v0/b/fir-prac-3866d.appspot.com/o/undefined%2Fopen_graph_icon.png?alt=media&token=8b96e64b-0b76-4eb9-8953-251f634b71c5"
          />
        </Head>

        <div>
          <Toaster reverseOrder={false} />
        </div>
        {children}
      </body>
    </html>
  );
}
