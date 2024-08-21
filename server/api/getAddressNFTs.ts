// Setup: npm install alchemy-sdk
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

  if (request.method === 'OPTIONS') {
    return new Response("");
  }
  const parsedUrl = url.parse(request.url, true);
  const queryParams = parsedUrl.query;
  const address = queryParams.address;
  if (!address) {
    return new Response(`no address requested`)
  }
  if (Array.isArray(address)) {
    return new Response('there should only be one address per request')
  }
  const nfts = await getNFTsFrom(address);
  const res = new Response(`${nfts.toString()}`);
  res.headers.append('Access-Control-Allow-Credentials', "true");
  res.headers.append('Access-Control-Allow-Origin', 'https://www.uarehere.online/'); // move to env variable
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.headers.append('Access-Control-Allow-Methods', 'GET');
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return res;
}