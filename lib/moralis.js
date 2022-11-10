import Moralis from "moralis";

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
