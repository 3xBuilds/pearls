import { Inter } from "next/font/google";
import "./globals.css";
import candybeans from "next/font/local"
import Providers from "@/utils/Providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const font = candybeans({ src: "../assets/fonts/candy-beans.otf" })


export const metadata = {
  title: "Pearls NFT",
  description: "Pearls NFT collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className + ""}>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
