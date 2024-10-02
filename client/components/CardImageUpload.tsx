import React, { useState } from 'react';
import styles from './styles/CardImageUpload.module.css';

interface CardImageUploadProps {
    onConfirm: (editingCards: string[]) => void;
}

const CardImageUpload: React.FC<CardImageUploadProps> = ({ onConfirm }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingCards, setEditingCards] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [doneEditing, setDoneEditing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        setUploading(true);

        try {
            const response = await fetch('http://localhost:8000/cards', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setEditingCards(data.hand);
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDoneEditing = () => {
        onConfirm(editingCards);
        setDoneEditing(true);
    };

    if (doneEditing) {
        return (
            <div className={styles.uploadedText}>
                Uploaded! ✅
            </div>
        )
    }

    return (
        <div className={styles.cardImageUpload}>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className={styles.fileInput}
                />
                <button 
                    type="submit" 
                    className={styles.uploadButton}
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>
            <div className={styles.editingSection}>
                {editingCards.length > 0 ? (
                    <>
                        <input
                            type="text"
                            value={editingCards.join(' ')}
                            onChange={(e) => setEditingCards(e.target.value.split(' '))}
                            className={styles.editingInput}
                        />
                        <button 
                            type="button" 
                            onClick={handleDoneEditing}
                            className={styles.doneButton}
                        >
                            Done Editing
                        </button>
                    </>
                ) : (
                    <p>No cards uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default CardImageUpload;