import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

import Head from "next/head";
import Image from "next/image";
import Logo from "/public/logo.png";

import Link from "next/link";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.polygon],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-900 dark:to-black text-zinc-100 min-h-screen'>
      <Head>
        <title>web3Imgur | Image IPFS Uploader</title>
        <meta
          name='description'
          content='Upload your image to IPFS and get simple links for sharing'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='min-h-[100vh] flex flex-col '>
        <nav className='w-[1200px] mx-auto mt-4 text-left flex justify-between'>
          <Image
            className='cursor-pointer'
            onClick={() => window.location.reload()}
            width={200}
            height={200}
            src={Logo}
          />
          <Link href='./feed'>
            <button className=' bg-green-500 w-[102px] px-4 py-2 mt-4 text-black font-bold rounded disabled:bg-zinc-500'>
              FEED
            </button>
          </Link>
        </nav>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </main>
      <Toaster />
    </div>
  );
}

export default MyApp;
