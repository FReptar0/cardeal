// pages/_app.js
import "../styles/global.css";
import "../styles/index.css";
import 'react-phone-input-2/lib/style.css';
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "../utils/theme";
import Layout from "../components/Layout";
import { SearchProvider } from "../contexts/SearchContext";
import { BookingProvider } from "../contexts/BookingContext";
import { AuthProvider } from "../contexts/AuthContext"; // Importamos el AuthProvider
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const useLayout = Component.useLayout ?? true;

  return (
    <>
      <Head>
        <link rel="icon" href="/logos/logo.png" />
        <link
          href="/logos/logo.png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <title>Qardeal</title>
      </Head>

      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SearchProvider>
          <BookingProvider>
            <AuthProvider>
              {useLayout ? (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              ) : (
                <Component {...pageProps} />
              )}
                <ToastContainer position="top-right" autoClose={2000} />
            </AuthProvider>
          </BookingProvider>
        </SearchProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
