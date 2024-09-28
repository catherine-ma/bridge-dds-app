import Head from 'next/head';
import Link from 'next/link';
import styles from './styles/Home.module.css';

const Home: React.FC = () => {
    return (
        <>
            <Head>
                <title>BridgeBrain 🧠</title>
                <meta name="description" content="A platform for galaxy brain bridge plays" />
            </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>Welcome to BridgeBrain 🧠</h1>
                <Link href="/sessions">
                    <button className={styles.enterButton}>Enter</button>
                </Link>
            </div>
        </>
    );
};

export default Home;
