import '../styles/global.css';

// pages/_app.js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from '../utils/theme';
import Head from 'next/head';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.png" />
                <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon"></link>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {/* LAYOUT TIENE RODEANDO UN COMPONENTE BOX PARA EVITAR EL EL SHRINK QUE HACE EL CONTAINER */}
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
        </>
    );
}

export default MyApp;