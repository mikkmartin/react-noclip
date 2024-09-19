import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { GlobalStyles } from '../../components/GlobalStyles'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>next-ts-starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
