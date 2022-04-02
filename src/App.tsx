import './App.css';
import { Button, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutComponent from './components/layout/layout.component';
import { plPL } from '@mui/material/locale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsPL from './i18n/translations-pl.json'
import RegisterPage from './pages/register.page';
import { SnackbarProvider } from 'notistack';

const theme = createTheme(
  {
    // palette: {
    //   primary: {
    //     main: red[500]
    //   }
    // }
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
  })

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
          <LayoutComponent>
            <Routes>
              <Route path='/register' element={<RegisterPage />} />
            </Routes>
          </LayoutComponent>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
