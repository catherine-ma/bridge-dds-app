import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Session.module.css';
import CardImageUpload from '../../components/CardImageUpload';

const SessionPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [sessionName, setSessionName] = useState('');
    const [dealNumber, setDealNumber] = useState(0);
    const [uploadedCards, setUploadedCards] = useState<{ [key: string]: string[] }>({
        north: [],
        south: [],
        east: [],
        west: [],
    });
    const [cardsUploaded, setCardsUploaded] = useState<{ [key: string]: boolean }>({
        north: false,
        south: false,
        east: false,
        west: false,
    });

    const [dealer, setDealer] = useState('');
    const [contractNumber, setContractNumber] = useState<number>();
    const [contractSuit, setContractSuit] = useState('');
    const [contractDoubled, setContractDoubled] = useState('');
    const [isVulnerable, setIsVulnerable] = useState(false);

    const [dealResult, setDealResult] = useState('');

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const response = await fetch(`http://localhost:8000/session/${id}`);
            if (response.ok) {
                const sessionData = await response.json();
                setSessionName(sessionData.name);
                setDealNumber(sessionData.deal_number);
            }
        };

        if (id) {
            fetchSessionDetails();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            uploadedCards,
            dealer,
            contractNumber,
            contractSuit,
            contractDoubled,
            isVulnerable,
            dealResult,
        };

        const response = await fetch(`http://localhost:8000/deal/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // Handle success (e.g., show a success message or redirect)
        } else {
            // Handle error
        }
    };

    const handleConfirmCards = async (direction: string, editingCards: string[]) => {
        setCardsUploaded((prev) => ({
            ...prev,
            [direction]: true,
        }));
        setUploadedCards((prev) => ({
            ...prev,
            [direction]: editingCards,
        }));
    };

    return (
        <>
            <Head>
                <title>BridgeBrain 🧠</title>
                <meta name="description" content="A platform for galaxy brain bridge plays" />
            </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>{`${sessionName} - Deal #${dealNumber}`}</h1>

                <div className={styles.uploadSection}>
                    {['north', 'south', 'east', 'west'].map((direction) => (
                        <div key={direction}>
                            <label className={styles.uploadHandHeader}>{`Upload ${direction.charAt(0).toUpperCase() + direction.slice(1)} hand:`}</label>
                            <CardImageUpload
                                onConfirm={(editingCards) => handleConfirmCards(direction, editingCards)}
                            />
                        </div>
                    ))}
                </div>

                {cardsUploaded.north && cardsUploaded.south && cardsUploaded.east && cardsUploaded.west && (
                    <div className={styles.formSection}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className={styles.label}>
                                    Dealer:
                                    <select className={styles.inputField} value={dealer} onChange={(e) => setDealer(e.target.value)} required>
                                        <option value="">Select Dealer</option>
                                        <option value="north">North</option>
                                        <option value="south">South</option>
                                        <option value="east">East</option>
                                        <option value="west">West</option>
                                    </select>
                                </label>
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Contract Number:
                                    <input
                                        className={styles.inputField}
                                        type="number"
                                        value={contractNumber}
                                        onChange={(e) => setContractNumber(Number(e.target.value))}
                                        min="1"
                                        max="7"
                                        required
                                    />
                                </label>
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Contract Suit:
                                    <select className={styles.inputField} value={contractSuit} onChange={(e) => setContractSuit(e.target.value)} required>
                                        <option value="">Select Suit</option>
                                        <option value="club">Club</option>
                                        <option value="diamond">Diamond</option>
                                        <option value="heart">Heart</option>
                                        <option value="spade">Spade</option>
                                    </select>
                                </label>
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Doubled:
                                    <select className={styles.inputField} onChange={(e) => setContractDoubled(e.target.value)} required>
                                        <option value="not_doubled">Not Doubled</option>
                                        <option value="doubled">Doubled</option>
                                        <option value="redoubled">Redoubled</option>
                                    </select>
                                </label>
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Vulnerable:
                                    <input
                                        type="checkbox"
                                        className={styles.checkboxInput}
                                        checked={isVulnerable}
                                        onChange={(e) => setIsVulnerable(e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Deal Result:
                                    <select
                                        className={styles.inputField}
                                        value={dealResult}
                                        onChange={(e) => setDealResult(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Result</option>
                                        {Array.from({ length: 20 }, (_, i) => i - 13).map(num => (
                                            <option key={num} value={num}>
                                                {num >= 0 ? `+${num}` : num}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <button type="submit" className={styles.submitButton}>Submit</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default SessionPage;