import Head from 'next/head';

import { Header } from '../components/Header';

import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { theme } from '../theme';

import '../styles/globals.scss';
import 'macro-css';
import { wrapper } from '../redux/store';
import { AppProps } from 'next/app';
import { parseCookies } from 'nookies';
import { setUserData } from '../redux/slices/user';
import { UserApi } from '../utils/api/user';
import { Api } from '../utils/api';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>RJournal</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <Header />
        <Component {...pageProps} />
      </MuiThemeProvider>
    </>
  );
}
MyApp.getInitialProps = wrapper.getInitialAppProps((store) => async ({ ctx, Component }) => {
  try {
    const data = await Api(ctx).user.preAuth();
    store.dispatch(setUserData(data));
  } catch (error) {
    if (ctx.asPath === '/write') {
      ctx.res?.writeHead(302, {
        location: '/403',
      });
      ctx.res?.end();
    }
    console.warn(error);
  }
  return {
    pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {},
  };
});
export default wrapper.withRedux(MyApp);
