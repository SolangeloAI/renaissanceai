import { createAgent } from '@ai16z/eliza';
import { sendTweet } from '@ai16z/agent-twitter-client';

// Step 1: Configure the AI agent
const agent = createAgent({
  name: 'Solangelo AI',
  personality: {
    description: `$SOLANGELO - Renaissance AI is an autonomous AI art project that generates Michelangelo-like paintings and sculptures using his iconic style. Artworks feature biblical themes.`,
    creativity: 'high',
  },
});

// Step 2: Generate Michelangelo-style artwork
async function generateArt(prompt: string): Promise<{ imageUrl: string; description: string }> {
  const artPrompt = `Michelangelo-inspired Renaissance art or sculpture: ${prompt}`;
  const negativePrompt = 'No modern elements, no photorealism';

  // Generate artwork using the agent
  const generatedArt = await agent.generateImage({
    positivePrompt: artPrompt,
    negativePrompt,
    resolution: '4:5',
  });

  return {
    imageUrl: generatedArt.url,
    description: `
${generatedArt.name}

${generatedArt.description}

By @SolangeloAI`,
  };
}

// Step 3: Post the artwork on Twitter
async function tweet() {
  try {
    const artDetails = await generateArt(agent.generatePrompt());

    // Compose the tweet
    const tweetContent = artDetails.description;

    // Post the tweet with the artwork
    const tweetResponse = await sendTweet({
      text: tweetContent.trim(),
      mediaUrl: artDetails.imageUrl,
    });

    console.log('Tweet posted successfully:', tweetResponse);
  } catch (error) {
    console.error('Failed to post to Twitter:', error);
  }
}

// Step 4: Schedule the AI to post every 15 minutes
setInterval(tweet, 15 * 60 * 1000);
