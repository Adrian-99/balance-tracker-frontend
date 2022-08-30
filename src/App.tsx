import './App.css';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import LayoutComponent from './components/layout/layout.component';
import { plPL } from '@mui/material/locale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsPL from './i18n/translations-pl.json'
import { SnackbarProvider } from 'notistack';
import PagesRouting from './pages-routing';
import ApplicationContextProvider from './components/application-context.provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import plPLPickersLocaleText from './i18n/plPLPickersLocaleText';
import moment from 'moment';
import 'moment/locale/pl';

const theme = createTheme(
    {
        // palette: {
        //   primary: {
        //     main: "#ff0000"
        //   }
        // },
        components: {
            MuiTableCell: {
                styleOverrides: {
                    root: ({ ownerState }) => ({
                        ...(ownerState.size === "small" && { padding: "6px 2px" })
                    })
                }
            }
        }
    },
    plPL
);

i18n.use(initReactI18next)
    .init({
        interpolation: { escapeValue: false },
        lng: 'pl',
        resources: {
            pl: {
                translation: translationsPL
            }
        }
    });

moment.locale("pl");

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                >
                <BrowserRouter>
                    <ApplicationContextProvider>
                        <LocalizationProvider
                            dateAdapter={AdapterMoment}
                            localeText={plPLPickersLocaleText}
                        >
                            <LayoutComponent>
                                <PagesRouting />
                            </LayoutComponent>
                        </LocalizationProvider>
                    </ApplicationContextProvider>
                </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
