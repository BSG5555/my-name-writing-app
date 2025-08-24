import React from 'react';
import Head from 'next/head';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Layout from '@/Layout';

export default function MyApp({ Component, pageProps, router }) {
  // Extract page name from router pathname  
  const getPageName = (pathname) => {
    if (pathname === '/') return 'Home';
    return pathname.substring(1);
  };

  const currentPageName = getPageName(router?.pathname || '/');

  return (
    <>
      <Head>
        <title>My Name Writing App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout currentPageName={currentPageName}>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="top-right" />
    </>
  );
}
