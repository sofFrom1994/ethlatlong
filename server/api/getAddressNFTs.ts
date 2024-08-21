import { Alchemy, Network } from "alchemy-sdk";
import url from "url"

const alchemyConfig = {
  apiKey: process.env.ALCHEMY_API_URL,
  network: Network.BASE_SEPOLIA,
};
const alchemy = new Alchemy(alchemyConfig);

const getNFTsFrom = async (address: string) => {
  const nfts = await alchemy.nft.getNftsForOwner(address);
  const nftList = nfts["ownedNfts"];
  return nftList;
}

export async function GET(request: Request) {

const parsedUrl = url.parse(request.url, true);
  const queryParams = parsedUrl.query;
  const address = queryParams.address;
  if (!address) {
    return new Response(`no address requested`, { status: 400 })
  }
  if (Array.isArray(address)) {
    return new Response('there should only be one address per request')
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': "true",
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || "none",
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  });
  console.log(headers);

  if (request.method === 'OPTIONS') {
    return new Response("", {status: 200, headers});
  }

  const nfts = await getNFTsFrom(address);

  const res = new Response(JSON.stringify(nfts), { status: 200, headers: headers });

  return res;
}