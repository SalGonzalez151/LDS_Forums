import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch categories from the server
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3001/categories/categories');

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched categories:', data); // Debug log
                    if (Array.isArray(data)) {
                        setCategories(data);
                    } else {
                        console.error('Categories is not an array:', data);
                        setCategories([]);
                    }
                } else {
                    console.error('Failed to fetch categories');
                }

            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing
    
        if (!title.trim() || !content.trim() || !category) {
            setError("Title, content, and category are required");
            return;
        }
    
        const postData = { title, content, categoryId: category }; // category is the ID of the selected category
    
        console.log('Post data:', postData); // Log to check the post data
        console.log('Selected category:', category);
        console.log('Category value:', category);
        
        // Log token to see if it's available in localStorage
        const token = localStorage.getItem('token');
        console.log('Token:', token); // This will show if the token is in localStorage
    
        if (!token) {
            console.error('No token found');
            setError('You must be logged in to create a post');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });
    
            const responseData = await response.json(); // Get response data
            console.log('Response from server:', responseData); // Log the server response
    
            if (response.ok) {
                navigate('/'); // Navigate to the home page if successful
            } else {
                setError("Failed to create Post.");
            }
        } catch (error) {
            console.error('Error', error);
            setError("An error occurred while creating the post.");
        }
    };
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Create a New Post
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {Array.isArray(categories) ? categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        )) : (
                            <MenuItem disabled>No categories available</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button type="button" onClick={() => navigate('/')} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
