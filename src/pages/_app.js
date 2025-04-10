// pages/_app.js
import "../styles/global.css";
import "../styles/index.css";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "../utils/theme";
import Layout from "../components/Layout";
import { SearchProvider } from "../contexts/SearchContext";
import { BookingProvider } from "../contexts/BookingContext";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/logos/logo.png" />
                <title>Qardeal</title>
            </Head>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <SearchProvider>
                    <BookingProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </BookingProvider>
                </SearchProvider>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
