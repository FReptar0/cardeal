import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0B5D3C',
            text: '#10906a',
            buttons: '#10906a',
            buttonHover: '#0B5D3C',
        },
        secondary: {
            main: '#d60812',
            text: '#c43c45',
            buttons: '#d60812',
            buttonHover: '#c43c45',
        },
    },
});

export default darkTheme;