import Head from 'next/head';

import Layout from '../components/layout/layout';
import '../styles/globals.css';
import { NotificationContextProvider } from '../contexts/notification-context';

export default function MyApp({ Component, pageProps }) {
    return (
        <NotificationContextProvider>
            <Layout>
                <Head>
                    <title>NextEventer</title>
                    <meta name="description" content="NextJS Events" />
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
                </Head>
                <Component {...pageProps} />
            </Layout>
        </NotificationContextProvider>
    );
}
