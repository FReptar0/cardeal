import React from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Container,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

// Esquema de validación con Yup
const validationSchema = yup.object({
    nombre: yup
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .required('El nombre es obligatorio'),
    email: yup
        .string()
        .email('Ingrese un email válido')
        .required('El email es obligatorio'),
    telefono: yup
        .string()
        .matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos')
        .required('El teléfono es obligatorio'),
    nombreEmpresa: yup
        .string()
        .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
        .max(100, 'El nombre de la empresa no puede exceder 100 caracteres')
        .required('El nombre de la empresa es obligatorio'),
    rfc: yup
        .string()
        .test('rfc-valido', 'El RFC no tiene un formato válido', (value) => {
            if (!value) return true;
            return /^[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]$/.test(value);
        })
        .nullable(),
    aceptaTerminos: yup
        .boolean()
        .oneOf([true], 'Debe aceptar los términos y condiciones'),
});

const BusinessRegistrationForm = () => {
    const formik = useFormik({
        initialValues: {
            nombre: '',
            email: '',
            telefono: '',
            nombreEmpresa: '',
            rfc: '',
            aceptaTerminos: false,
        },
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await fetch('/api/crmContact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: values.nombre,
                        email: values.email,
                        telefono: values.telefono,
                        nombreEmpresa: values.nombreEmpresa,
                        rfc: values.rfc,
                        mensaje: values.mensaje || '',
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success('¡Solicitud enviada correctamente! Nos pondremos en contacto contigo pronto.');
                    resetForm();
                } else {
                    toast.error(data.message || 'Error al enviar la solicitud.');
                }
            } catch (err) {
                toast.error('Error de conexión al enviar la solicitud.');
            }
        },
    });

    return (
        <>
        <ToastContainer position="top-center" autoClose={5000} />
        <Box 
            sx={{ 
                minHeight: '100vh', 
                bgcolor: '#f8f9fa',
                py: { xs: 4, md: 6 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 12
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Paper 
                    elevation={3}
                    sx={{ 
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        bgcolor: 'white'
                    }}
                >
                    <Grid container sx={{ minHeight: { md: '600px' } }}>
                        {/* Sección izquierda - Información */}
                        <Grid 
                            item 
                            xs={12} 
                            md={6} 
                            sx={{ 
                                display: { xs: 'none', md: 'flex' },
                                color: 'white',
                                p: { md: 6, lg: 8 },
                                alignItems: 'center',
                                position: 'relative',
                                backgroundImage: 'url(/photos/suv-standard/Kicks-faro-izq.webp)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
                                    zIndex: 1
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 2 }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 4,
                                        lineHeight: 1.2,
                                        fontSize: { md: '2.5rem', lg: '3rem' }
                                    }}
                                >
                                    Soluciones empresariales a tu medida
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontSize: { md: '1.1rem', lg: '1.2rem' }, 
                                        lineHeight: 1.6,
                                        fontWeight: 400
                                    }}
                                >
                                    Queremos escuchar sus necesidades y trabajar juntos para diseñar soluciones, propuestas operativas y financieras que realmente se adapten a su empresa.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Sección derecha - Formulario */}
                        <Grid 
                            item 
                            xs={12} 
                            md={6} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                p: { xs: 3, sm: 4, md: 6, lg: 8 }
                            }}
                        >
                            <Box sx={{ width: '100%', maxWidth: '480px', mx: 'auto' }}>
                                {/* Título móvil */}
                                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, textAlign: 'center' }}>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            color: 'primary.main',
                                            mb: 2
                                        }}
                                    >
                                        Soluciones empresariales
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Conectamos contigo para ofrecerte las mejores soluciones
                                    </Typography>
                                </Box>

                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 4, 
                                        fontWeight: 600, 
                                        color: theme => theme.palette.primary.main,
                                        textAlign: { xs: 'center', md: 'left' }
                                    }}
                                >
                                    Déjanos tus datos y nos pondremos en contacto contigo
                                </Typography>

                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container spacing={3}>
                                        {/* Nombre */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="nombre"
                                                name="nombre"
                                                label="Nombre *"
                                                value={formik.values.nombre}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                                helperText={formik.touched.nombre && formik.errors.nombre}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                size="medium"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Email y Teléfono */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                name="email"
                                                label="E-mail *"
                                                type="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                size="medium"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="telefono"
                                                name="telefono"
                                                label="Teléfono *"
                                                value={formik.values.telefono}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                                                helperText={formik.touched.telefono && formik.errors.telefono}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                size="medium"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Nombre de empresa y RFC */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="nombreEmpresa"
                                                name="nombreEmpresa"
                                                label="Nombre de su empresa *"
                                                value={formik.values.nombreEmpresa}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.nombreEmpresa && Boolean(formik.errors.nombreEmpresa)}
                                                helperText={formik.touched.nombreEmpresa && formik.errors.nombreEmpresa}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <BusinessIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                size="medium"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="rfc"
                                                name="rfc"
                                                label="RFC"
                                                value={formik.values.rfc}
                                                onChange={(e) => {
                                                    formik.setFieldValue('rfc', e.target.value.toUpperCase());
                                                }}
                                                onBlur={formik.handleBlur}
                                                error={!!formik.values.rfc && formik.touched.rfc && Boolean(formik.errors.rfc)}
                                                helperText={
                                                    !!formik.values.rfc && formik.touched.rfc && formik.errors.rfc 
                                                        ? formik.errors.rfc 
                                                        : 'Opcional'
                                                }
                                                placeholder="Ej: ABC123456XYZ"
                                                size="medium"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Mensaje adicional */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="mensaje"
                                                name="mensaje"
                                                label="Mensaje adicional (opcional)"
                                                value={formik.values.mensaje}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                multiline
                                                minRows={3}
                                                maxRows={6}
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Checkbox de términos */}
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        id="aceptaTerminos"
                                                        name="aceptaTerminos"
                                                        checked={formik.values.aceptaTerminos}
                                                        onChange={formik.handleChange}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: formik.touched.aceptaTerminos && formik.errors.aceptaTerminos 
                                                                ? 'error.main' 
                                                                : 'text.secondary',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        Utilizaremos tus datos para ponernos en contacto contigo. Si estás de acuerdo,{' '}
                                                        <Button 
                                                            variant="text" 
                                                            sx={{ 
                                                                p: 0, 
                                                                textTransform: 'none', 
                                                                textDecoration: 'underline',
                                                                fontSize: 'inherit',
                                                                minWidth: 'auto',
                                                                verticalAlign: 'baseline'
                                                            }}
                                                        >
                                                            consulta nuestro aviso de privacidad
                                                        </Button>
                                                    </Typography>
                                                }
                                            />
                                            {formik.touched.aceptaTerminos && formik.errors.aceptaTerminos && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="error.main" 
                                                    sx={{ display: 'block', mt: 1, ml: 4 }}
                                                >
                                                    {formik.errors.aceptaTerminos}
                                                </Typography>
                                            )}
                                        </Grid>

                                        {/* Elementos obligatorios */}
                                        <Grid item xs={12}>
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{ fontSize: '0.85rem' }}
                                            >
                                                * Campos obligatorios
                                            </Typography>
                                        </Grid>

                                        {/* Botón de envío */}
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    py: 2,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                                    '&:hover': {
                                                        bgcolor: 'primary.dark',
                                                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    '&:disabled': {
                                                        bgcolor: '#ccc',
                                                        boxShadow: 'none',
                                                        transform: 'none'
                                                    },
                                                    transition: 'all 0.2s ease-in-out'
                                                }}
                                                disabled={!formik.isValid || !formik.dirty}
                                            >
                                                Enviar solicitud
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
        </>
    );
};

export default BusinessRegistrationForm;