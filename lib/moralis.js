import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

export async function upLoadIPFS(content) {
  const abi = [
    {
      path: "pfp.jpg",
      content: content,
    },
  ];

  await Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    // ...and any other configuration
  });

  const response = await Moralis.EvmApi.ipfs.uploadFolder({
    abi,
  });

  return response.result[0].path;
}

export async function getAllNFT() {
  const chain = EvmChain.POLYGON;

  const address = "0x1439a5Bbb6e8b75f6189372E2a681dF31d891a59";

  await Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    // ...and any other configuration
  });

  const response = await Moralis.EvmApi.nft.getContractNFTs({
    address,
    chain,
  });

  return response.result;
}
