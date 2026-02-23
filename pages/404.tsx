import React from "react";
import NotFound from "@/components/common/NotFound";
import Head from "next/head";

export const getStaticProps = () => {
    return {
        props: {
            is404: true
        }
    }
}

const NotFoundPage = () => {
    return (
        <>
            <Head>
                <title>404 Not Found - Indian Hair World</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <NotFound />
        </>
    )
};

export default NotFoundPage;
