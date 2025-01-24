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
  CircularProgress,
} from '@mui/material';
import { convertVideo } from '../api/conversionApi';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        YouTube Converter
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          backgroundColor: '#f8f9fa',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
          disabled={loading || !youtubeUrl}
          sx={{ 
            height: 48,
            position: 'relative',
            backgroundColor: '#1976d2'
          }}
        >
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              <CircularProgress 
                size={30}
                sx={{ color: 'white' }}
              />
            </Box>
          ) : 'CONVERT'}
        </Button>
 
        {resultMessage && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#e8f5e9',
            padding: '16px 24px',
            borderRadius: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: 'success.main' }} />
              <Typography>{resultMessage}</Typography>
            </Box>
            <Button
              href={downloadUrl}
              download={fileName}
              variant="contained"
              color="success"
              sx={{ 
                minWidth: 'auto',
                textTransform: 'uppercase'
              }}
            >
              Download video
            </Button>
          </Box>
        )}
 
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </Container>
 );
}