import React from 'react';
import './App.css';
import { Button, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { plPL } from '@mui/material/locale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsPL from './i18n/translations-pl.json'

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
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path='/test' element={
              <Button variant="contained">Contained</Button>
            } />
          </Routes>
        </BrowserRouter>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
