import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

const GlobalLoader = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };

        const handleComplete = () => {
            setLoading(false);
        };

        const handleError = () => {
            setLoading(false);
        };

        // Eventos del router de Next.js
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleError);

        // Cleanup - remover los event listeners
        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleError);
        };
    }, [router]);

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
            open={loading}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
            >
                <CircularProgress
                    color="primary"
                    size={60}
                    thickness={4}
                />
                <Typography variant="h6" component="div">
                    Cargando...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default GlobalLoader;