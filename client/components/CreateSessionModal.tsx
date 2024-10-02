import React from 'react';
import styles from './styles/CreateSessionModal.module.css';

interface CreateSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [sessionName, setSessionName] = React.useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(sessionName);
        setSessionName('');
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Create a new session</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className={styles.modalInput}
                        placeholder="Session Name"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.modalButton}>Create</button>
                    <button type="button" className={styles.modalButton} onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateSessionModal;