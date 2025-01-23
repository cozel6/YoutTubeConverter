// src/components/ConversionForm/ConversionForm.jsx
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
import { convertVideo } from '../api/conversionApi';

const qualityOptions = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];

export default function ConversionForm() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [quality, setQuality] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const isValidYoutubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResultMessage('');
    setDownloadUrl('');
    setError('');

    if (!isValidYoutubeUrl(youtubeUrl)) {
      setError('Please provide a valid YouTube URL');
      setLoading(false);
      return;
    }

    try {
      const data = await convertVideo({ youTubeUrl: youtubeUrl, quality });
      if (data.success) {
        setResultMessage(data.message);
        setDownloadUrl(data.downloadUrl);
        setFileName(data.fileName || 'video.mp4');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error or server is not responding.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        YouTube Converter
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
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

        <Button variant="contained" type="submit" disabled={loading || !youtubeUrl}>
          {loading ? 'Processing...' : 'Convert'}
        </Button>
      </Box>

      {resultMessage && (
        <Alert
          severity="success"
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {resultMessage}
          {downloadUrl && (
            <Box mt={1}>
              <a href={downloadUrl} download={fileName}>
                Download video
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
}
