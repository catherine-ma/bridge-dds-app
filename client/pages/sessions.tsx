import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CreateSessionModal from '../components/CreateSessionModal';
import styles from './styles/Sessions.module.css';
import { SessionStatus } from '../types';

interface Session {
    name: string;
    id: string;
    last_active: string;
    status: SessionStatus;
    num_deals: number;
}

const timeAgo = (date: string) => {
    const now = new Date();
    const lastActiveDate = new Date(date);
    const seconds = Math.floor((now.getTime() - lastActiveDate.getTime()) / 1000);

    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days} d ${hours} h ${minutes} m ago`;
};

const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            const response = await fetch('http://localhost:8000/sessions');
            const data = await response.json();
            setSessions(data);
        };

        fetchSessions();
    }, []);

    const handleCreateSession = async (name: string) => {
        const response = await fetch('http://localhost:8000/sessions/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        if (response.ok) {
            const newSession = await response.json();
            setSessions((prev) => [newSession, ...prev]);
        } else {
            alert('An error occurred!');
        }
    };

    return (
        <>
            <Head>
                <title>BridgeBrain 🧠</title>
                <meta name="description" content="A platform for galaxy brain bridge plays" />
            </Head>
            <div className={styles.container}>
                <button className={styles.createSessionButton} onClick={() => setIsModalOpen(true)}>Create New Session</button>
                <ul>
                    {sessions.map(session => (
                        <div key={session.id} className={styles.sessionCard}>
                            <div className={styles.sessionInfo}>
                                <div className={styles.sessionHeader}>
                                    <Link href={`/sessions/${session.id}`}>
                                        <h3>{session.name}</h3>
                                    </Link>
                                    <span className={`${styles.pill} ${session.status === SessionStatus.InProgress ? styles.statusInProgress : styles.statusEnded}`}>
                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)} {/* Capitalize status */}
                                    </span>
                                    <span className={styles.pill}>
                                        Last active: {timeAgo(session.last_active)}
                                    </span>
                                </div>
                                <div className={styles.sessionDseals}>
                                    {session.num_deals} Deals
                                </div>
                            </div>
                        </div>
                    ))}
                </ul>
                <CreateSessionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateSession}
                />
            </div>
        </>
    );
};

export default Sessions;