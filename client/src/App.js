// src/App.js
import React from 'react';
import { Button, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to LDS Forums
      </Typography>
      <Typography variant="body1" paragraph>
        Join the discussion and explore new topics!
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
  );
}

export default App;
