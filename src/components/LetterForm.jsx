import { CohereClientV2 } from 'cohere-sdk';

const client = new CohereClientV2();

async function fetchResponse(prompt) {
    try {
        const response = await client.generate({
            prompt: prompt,
            maxTokens: 100
        });
        return response;
    } catch (error) {
        console.error('Error fetching response from Cohere:', error);
        throw error;
    }
}

export default fetchResponse;