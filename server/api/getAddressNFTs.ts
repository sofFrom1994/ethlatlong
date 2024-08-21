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
    const optionsResponse = new Response("", { status: 204 });
    optionsResponse.headers.set('Access-Control-Allow-Credentials', "true");
    optionsResponse.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || "none");
    optionsResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    optionsResponse.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return optionsResponse;
  }
  const parsedUrl = url.parse(request.url, true);
  const queryParams = parsedUrl.query;
  const address = queryParams.address;
  if (!address) {
    return new Response(`no address requested`, { status: 400 })
  }
  if (Array.isArray(address)) {
    return new Response('there should only be one address per request')
  }

  const nfts = await getNFTsFrom(address);
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': "true",
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || "none",
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  })
  const res = new Response(JSON.stringify(nfts), { status: 200, headers: headers });

  return res;
}