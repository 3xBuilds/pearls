import { Inter } from "next/font/google";
import "./globals.css";
import candybeans from "next/font/local"
import Providers from "@/utils/Providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from "./opengraph-image.png"
const font = candybeans({ src: "../assets/fonts/candy-beans.otf" })


export const metadata = {
  title: "Pearls NFT",
  description: "Pearls NFT collection",

  openGraph: {
    title: 'Taco Tribe Dapp',
    description: 'Taco taco moreee tacooo',
    url: 'https://tacotribe.vercel.app',
    siteName: 'Taco Tribe Shop',
    images: [
      {
        url: image,
        width: 800,
        height: 600,
      },
      {
        url: image,
        width: 1800,
        height: 1600,
        alt: 'Taco Tribe Shop',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taco Tribe Dapp',
    description: 'aco taco moreee tacooo',
    siteId: '1467726470533754880',
    creator: '@3xbuilds',
    creatorId: '1467726470533754880',
    images: [image],
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         
      </head>
      <body className={font.className + ""}>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
