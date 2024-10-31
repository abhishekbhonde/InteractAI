// src/ChatComponent.js
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { HfInference } from '@huggingface/inference';

const client = new HfInference('hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'); // Replace with your API key

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const ChatComponent = () => {
    const [input, setInput] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!input) return;

        setOutput('');
        setLoading(true);

        try {
            const stream = client.chatCompletionStream({
                model: 'Qwen/Qwen2.5-72B-Instruct',
                messages: [{ role: 'user', content: input }],
                max_tokens: 500,
            });

            let out = '';

            for await (const chunk of stream) {
                if (chunk.choices && chunk.choices.length > 0) {
                    const newContent = chunk.choices[0].delta.content;
                    out += newContent;
                    setOutput((prev) => prev + newContent); // Update output incrementally
                }
            }
            setLoading(false);
            setInput(''); // Clear input after submission
        } catch (error) {
            console.error(error);
            setError(true);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <CssBaseline />
            <Card variant="outlined">
                <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
                    Chat with AI
                </Typography>
                <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                    <TextField
                        required
                        fullWidth
                        id="message"
                        label="Type your message"
                        variant="outlined"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'primary.dark',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? 'Loading...' : 'Send'}
                    </Button>
                </Stack>
                {output && (
                    <Box sx={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
                        <Typography variant="h6">Response:</Typography>
                        <Typography>{output}</Typography>
                    </Box>
                )}
                {error && <Typography sx={{ color: 'red', textAlign: 'center' }}>Error: Unable to get response.</Typography>}
            </Card>
        </Box>
    );
};

export default ChatComponent;
