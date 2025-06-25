// pages/_app.js
import "../styles/global.css";
import "../styles/index.css";
import "react-phone-input-2/lib/style.css";
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
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const useLayout = Component.useLayout ?? true;

  const toastContainerExcludedRoutes = [
    "/login",
    "/recuperar-cuenta",
    "/cambiar-acceso",
  ];

  const isExcluded = toastContainerExcludedRoutes.includes(router.pathname);

  return (
    <>
      <Head>
        <link
          rel="icon"
          href="/logos/Logo_verde.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="shortcut icon"
          href="/logos/Logo_verde.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logos/Logo_verde.png"
        />
        <meta name="msapplication-TileImage" content="/logos/Logo_verde.png" />
        <meta name="msapplication-TileColor" content="#191919" />
        <meta name="theme-color" content="#191919" />
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
              {/* Solo renderiza el ToastContainer global si no está en una ruta excluida */}
              {!isExcluded && (
                <ToastContainer position="top-right" autoClose={2000} />
              )}{" "}
            </AuthProvider>
          </BookingProvider>
        </SearchProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
