# eth-lat-long 

< you are here >

Explore and build a world map through layers built by their users. Embed messages, (todo) casts, 
or nfts. Draw paths(todo), plan tours. 

## To run on dev 

From both ./contracts and ./frontend run:

```
npm install
```

Then we will need a process running a hardhat network node. From 
./contracts run:

```
npx hardhat node
```

On a separate process, while hardhat node runs. Compile and deploy the contracts with: 

```
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/EthLatLong.ts --network localhost
```
From ./frontend, run :

```
npm run dev
```

Then visit the localhost-deployed site. 