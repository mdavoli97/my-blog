import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className="bg-white dark:bg-slate-800 min-h-screen">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
