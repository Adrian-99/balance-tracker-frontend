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
import LoginPage from './pages/login.page';
import { useAuthentication } from './hooks/authentication.hook';

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
  const { isUserLoggedIn } = useAuthentication();

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
              { isUserLoggedIn() ? 
                <></>
              :
                <>
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/login' element={<LoginPage />} />
                </>
              }
            </Routes>
          </LayoutComponent>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
