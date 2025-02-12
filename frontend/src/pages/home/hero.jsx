import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

export default function Section01() {
    return (
        <Container maxWidth={false} style={{ display: 'flex', alignItems: 'center', padding: '2rem', width: '100%' }}>
            <Box flex={1} style={{ textAlign: 'left' }}>
                <Box mb={4}>
                    <Typography variant="h3" component="h1" gutterBottom >
                        Stay Ahead of Rising Waters with <span style={{ color: 'blue' }}>Smart Flood Monitoring</span>
                    </Typography>
                    <Typography variant="h6" component="p" color="textSecondary" >
                        Real-Time Flood Alerts & Monitoring for Safer Communities
                    </Typography>
                </Box>
                <Box mb={4}>
                    <Typography variant="body1" component="p" style={{ fontSize: '11px' }}>
                        Floods can strike without warning, causing severe damage and disruption. Our cutting-edge IoT flood monitoring device provides real-time water level tracking, instant alerts, and actionable insights to help you stay prepared.
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" size="large">
                    Get Started
                </Button>
            </Box>
            <Box flex={1} style={{ textAlign: 'right' }}>
                <img src="https://www.icimod.org/wp-content/uploads/2021/04/final-telemetric.jpg" alt="Flood Monitoring" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
        </Container>
    );
}
