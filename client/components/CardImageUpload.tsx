import React, { useState } from 'react';
import { PlayerRole } from '../types';

interface CardImageUploadProps {
    player: PlayerRole;
}

const CardImageUpload: React.FC<CardImageUploadProps> = ({ player }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const url = new URL('http://localhost:8000/cards');
            url.searchParams.append('player', player);
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload succeeded: ', data);
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default CardImageUpload;