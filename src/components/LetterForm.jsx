import { CohereClientV2 } from 'cohere-sdk';

const client = new CohereClientV2({ apiKey: 'YOUR_COHERE_API_KEY' });

const generateResponse = async (prompt) => {
    try {
        const response = await client.generate({ prompt });
        return response;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
};

export default generateResponse;