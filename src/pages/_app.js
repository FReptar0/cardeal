import '../styles/global.css';
import "../styles/index.css";

// pages/_app.js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from '../utils/theme';
import Head from 'next/head';
import Layout from '../components/Layout';
import { SearchProvider } from '../contexts/SearchContext'; // Asegúrate que la ruta sea la correcta

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
