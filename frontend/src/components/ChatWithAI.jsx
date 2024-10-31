import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face API client
const client = new HfInference('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'); // Replace with your API key

// Styled card for the chat window
const StyledCard = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    borderRadius: '16px',
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(4),
    width: '600px', // Width for the chat window
    height: '80vh', // Height for the chat window
    overflow: 'hidden',
}));

// Styled response box for displaying AI responses
const ResponseBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#000000', // Black background
    borderRadius: '10px',
    color: theme.palette.common.white, // White text color
    whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
    overflowY: 'auto', // Enable scrolling if content overflows
    maxHeight: '400px', // Increased height for the response box
    boxShadow: theme.shadows[2],
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
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px', // More padding around the component
                background: 'linear-gradient(135deg, #001f3f, #003366)', // Dark blue gradient
                height: '100vh', // Full height for the component
            }}
        >
            <StyledCard variant="outlined">
                <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                    Chat with AI
                </Typography>
                
                {/* Instructions Section */}
                <Typography variant="body2" sx={{ textAlign: 'center', marginBottom: '16px', color: '#ffffff' }}>
                    Type your message below and press "Send". The AI will respond based on your input. 
                    You can ask questions, seek advice, or just have a conversation!
                </Typography>
                
                <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ flexGrow: 1 }}>
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
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderRadius: '10px',
                                },
                                '& input': {
                                    color: '#ffffff', // Change input text color
                                },
                            },
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? 'Loading...' : 'Send'}
                    </Button>
                </Stack>
                {/* Place ResponseBox directly below the button */}
                <ResponseBox>
                    {output && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Response:</Typography>
                            <Typography component="pre" sx={{ fontFamily: 'monospace' }}>{output}</Typography>
                        </>
                    )}
                </ResponseBox>
                {error && <Typography sx={{ color: 'error.main', textAlign: 'center' }}>Error: Unable to get response.</Typography>}
            </StyledCard>
        </Box>
    );
};

export default ChatComponent;
