import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setError(''); // Clear previous errors
  
      try {
        console.log("Logging in with:", { email, password });
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('token', data.token); // Store JWT token
          navigate('/dashboard'); // Redirect after login
        } else {
          setError(data.error || 'Invalid credentials');
        }
      } catch (error) {
        setError('Something went wrong. Please try again.');
      }
    };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login to Your Account
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>

      
      <Button variant="contained" color="primary" component={Link} fullWidth sx={{mt: 2}} to="/">
        Go Home
      </Button>
    </Container>
  );
}

export default LoginPage;
