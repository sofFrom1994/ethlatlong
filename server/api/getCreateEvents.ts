import { Alchemy, Network } from "alchemy-sdk";
import url from "url"

const alchemyConfig = {
  apiKey: process.env.ALCHEMY_API_URL,
  network: Network.BASE_SEPOLIA,
};
const alchemy = new Alchemy(alchemyConfig);

const getCreateEvents = async () => {
  return await alchemy.core.getLogs({
    fromBlock: process.env.FROM_BLOCK,
    address: process.env.CONTRACT_ADDRESS,
    topics: [
      process.env.LAYER_ADDED_TOPIC!,
    ],
  });
}

export async function GET(request: Request) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': "true",
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || "none",
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  });

  if (request.method === 'OPTIONS') {
    return new Response("", { status: 200, headers });
  }

  const events = await getCreateEvents();

  const res = new Response(JSON.stringify(events), { status: 200, headers: headers });

  return res;
}