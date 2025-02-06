import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/favicon.png" />
                <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon"></link>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Main />
            <NextScript />
        </Html>
    )
}