import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-900 dark:to-black text-zinc-100 min-h-screen'>
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
}

export default MyApp;
