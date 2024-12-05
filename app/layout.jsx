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

        <meta property="og:title" content="Honesty Store" />
        <meta
          property="og:description"
          content="The best store with the best prices!"
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/fir-prac-3866d.appspot.com/o/undefined%2Fopen_graph_icon.png?alt=media&token=4f0a1ee3-f1c6-46a6-bd14-b37b83dbb0bc"
        />
        <meta property="og:url" content="https://honesty-store.vercel.app" />
        <meta property="og:type" content="website" />
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
