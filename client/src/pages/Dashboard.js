import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch posts from the server
    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        console.log(data); // Log the response to see the data structure
        setPosts(data); // Store posts in state
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard!
      </Typography>

      {/* Display Posts */}
      <Typography variant="h6" gutterBottom>
        Your Posts:
      </Typography>
      <List>
        {posts.map((post) => (
          <ListItem key={post._id}>
            <ListItemText primary={post.title} secondary={post.content} />
          </ListItem>
        ))}
      </List>

      {/* Action Buttons */}
      <Button variant="contained" color="primary" onClick={handleCreatePost}>Create Post</Button>
      <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
    </Container>
  );
}

export default Dashboard;
