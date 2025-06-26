// contexts/LoaderContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Backdrop, CircularProgress, Box, Typography, LinearProgress } from '@mui/material';

const LoaderContext = createContext();

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader debe ser usado dentro de LoaderProvider');
    }
    return context;
};

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Cargando...');
    const router = useRouter();

    // Función para mostrar loader manualmente
    const showLoader = (message = 'Cargando...') => {
        setLoadingMessage(message);
        setLoading(true);
    };

    // Función para ocultar loader manualmente
    const hideLoader = () => {
        setLoading(false);
    };

    useEffect(() => {
        let timeout;

        const handleStart = (url) => {
            // Solo mostrar loader si la navegación toma más de 200ms
            timeout = setTimeout(() => {
                setLoadingMessage('Cargando...');
                setLoading(true);
            }, 10);
        };

        const handleComplete = () => {
            clearTimeout(timeout);
            setLoading(false);
        };

        const handleError = () => {
            clearTimeout(timeout);
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleError);

        return () => {
            clearTimeout(timeout);
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleError);
        };
    }, [router]);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader, loading }}>
            {children}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }}
                open={loading}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    sx={{ minWidth: 200 }}
                >
                    <CircularProgress
                        color="primary"
                        size={50}
                        thickness={4}
                    />
                    <Typography variant="body1" component="div" textAlign="center">
                        {loadingMessage}
                    </Typography>
                    <LinearProgress
                        sx={{ width: '100%', mt: 1 }}
                        color="primary"
                    />
                </Box>
            </Backdrop>
        </LoaderContext.Provider>
    );
};

// Hook personalizado para usar el loader en componentes específicos
export const useManualLoader = () => {
    const { showLoader, hideLoader } = useLoader();

    const withLoader = async (asyncFn, message) => {
        try {
            showLoader(message);
            const result = await asyncFn();
            return result;
        } finally {
            hideLoader();
        }
    };

    return { showLoader, hideLoader, withLoader };
};