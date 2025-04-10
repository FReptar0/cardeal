// pages/_app.js
import "../styles/global.css";
import "../styles/index.css";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "../utils/theme";
import Layout from "../components/Layout";
import { SearchProvider } from "../contexts/SearchContext"; // Si ya lo usas
import { BookingProvider } from "../contexts/BookingContext"; // Importa el nuevo contexto

function MyApp({ Component, pageProps }) {
    const useLayout = Component.useLayout ?? true;

    return (
        <>
            <Head>
                <link rel="icon" href="/logos/logo.png" />
                <link href="/logos/logo.png" rel="shortcut icon" type="image/x-icon" />
                <title>Qardeal</title>
            </Head>

            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <SearchProvider>
                    {useLayout ? (
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </SearchProvider>
            </ThemeProvider>
        </>
    );
}
    

export default MyApp;
