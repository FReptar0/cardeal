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
    return (
        <>
            <Head>
                <link rel="icon" href="/logos/logo.png" />
                <link href="/logos/logo.png" rel="shortcut icon" type="image/x-icon" />
                <link rel="icon" href="/logos/logo.png" />
                <title>Qardeal</title>
            </Head>

            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {/* Ahora envolvemos todo dentro de SearchProvider para tener acceso global a la data */}
                <SearchProvider>
                    {/* LAYOUT TIENE RODEANDO UN COMPONENTE BOX PARA EVITAR EL SHRINK QUE HACE EL CONTAINER */}
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SearchProvider>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
