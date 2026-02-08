// Updated implementation using the latest Cohere SDK
import React, { useState } from 'react';
import { Cohere } from 'cohere-sdk'; // Assuming you have installed cohere-sdk

const LetterForm = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const cohere = new Cohere({
        apiKey: process.env.COHERE_API_KEY // Accessing API key from env variables
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await cohere.generate({
                prompt: input,
                model: 'your-model-name', // Replace this with the specific model name you are using
                // Other parameters as necessary
            });
            setOutput(response.body.text);
        } catch (error) {
            console.error('Error generating output:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit">Generate</button>
            <div>{output}</div>
        </form>
    );
};

export default LetterForm;