import { Cohere } from 'cohere-ai';

const cohereApiKey = process.env.COHERE_API_KEY;
const cohereClient = new Cohere(cohereApiKey);

// Use the cohereClient for your API calls instead of direct API calls

export const getChatbotResponse = async (prompt) => {
    try {
        const response = await cohereClient.generate({
            model: 'xlarge',
            prompt: prompt,
            maxTokens: 50
        });
        return response;
    } catch (error) {
        console.error('Error fetching response from Cohere:', error);
        throw error;
    }
};