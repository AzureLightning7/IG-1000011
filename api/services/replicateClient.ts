import Replicate from 'replicate';

export const getReplicateConfig = () => {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('Missing REPLICATE_API_TOKEN in environment');
  }

  return { apiToken };
};

export const replicateClient = (): Replicate => {
  const { apiToken } = getReplicateConfig();

  return new Replicate({
    auth: apiToken,
  });
};

export const redesignRoom = async (imageUrl: string, prompt: string) => {
  const replicate = new Replicate();
  //const replicate = replicateClient();

  const input = {
    image: imageUrl,
    prompt: prompt
  };

  const output = await replicate.run("adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38", { input });

  return output; // returns an object with url() method
};