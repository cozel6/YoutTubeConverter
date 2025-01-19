import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import axios from 'axios';

const qualityOptions = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
];

const ConversionForm = () => {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [quality, setQuality] = useState('3'); // Default value
    const [loading, setLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setResultMessage('');
        setDownloadUrl('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5213/api/Conversion', {
                youTubeUrl: youtubeUrl,
                quality: quality,
            });
            if (response.data.success) {
                setResultMessage(response.data.message);
                setDownloadUrl(response.data.downloadUrl);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('A apărut o eroare la conectarea cu serverul.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                YouTube Converter
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <TextField
                    label="YouTube URL"
                    variant="outlined"
                    value={youtubeUrl}
                    required
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                />

                <TextField
                    select
                    label="Quality"
                    variant="outlined"
                    value={quality}
                    required
                    onChange={(e) => setQuality(Number(e.target.value))}
                >
                    {qualityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Procesare...' : 'Converteste'}
                </Button>
            </Box>
            {resultMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {resultMessage}
                    {downloadUrl && (
                        <Box mt={1}>
                            <a href={downloadUrl} target="_blank" rel="noreferrer">
                                Descarcă videoclipul
                            </a>
                        </Box>
                    )}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default ConversionForm;
