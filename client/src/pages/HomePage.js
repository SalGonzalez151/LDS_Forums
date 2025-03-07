import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to LDS Forums
      </Typography>
      <Typography variant="body1" paragraph>
        Join the gaming discussions!
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login">
        Login
      </Button>
    </Container>
  );
}

export default HomePage;