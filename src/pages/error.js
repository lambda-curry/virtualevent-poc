import React  from "react";
import Layout from "../components/Layout";
import URI from "urijs";
import styles from '../styles/error.module.scss';

const ErrorPage = () => {
    let query = null;
    if (window && typeof window !== "undefined") {
        query = URI.parseQuery(window.location.search);
    }

    return (
        <Layout>
            <div className={styles.wrapper}>
                <h1>Error</h1>
                <p>Server returned with an error. Please contact admin.</p>
                <details>
                    {query.error}
                </details>
            </div>
        </Layout>
    );
};

export default ErrorPage;
