import Image from "next/image";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import Link from "next/link";

import { blobToBase64 } from "../lib/hooks";
import { upLoadIPFS } from "../lib/moralis";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
export default function DropManager() {
  const [hasDropped, setHasDropped] = useState(false);
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [share, setShare] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasMinted, setHasMinted] = useState(false);

  let isConnected = null;
  isConnected = useAccount();

  const callShare = () => {
    setShare(true);
    setTimeout(() => {
      setShare(false);
    }, 2000);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const data = await acceptedFiles[0];

      setImage(URL.createObjectURL(data));
      setHasDropped(true);
      const content = await blobToBase64(data);
      const ipfsObject = await upLoadIPFS(content);
      setLink(ipfsObject);
      toast.success("Uploaded successfully to IPFS.");
    } catch (error) {
      setHasDropped(false);
      toast.error("Only images accepted.");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const { config } = usePrepareContractWrite({
    address: "0x1439a5Bbb6e8b75f6189372E2a681dF31d891a59",
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "imageURL",
            type: "string",
          },
        ],
        name: "mintImg",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "mintImg",
    args: [title, description, link],
    overrides: {
      value: ethers.utils.parseEther("0.1"),
    },

    enabled: true,
  });

  const { write, data, isLoading } = useContractWrite(config);

  const { isLoading: txLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success(`You have successfully minted your image.`, {
        duration: 3000,
      });
      setHasMinted(true);
    },
  });

  return (
    <>
      {!hasDropped ? (
        <div>
          <div className='mx-auto h-[400px] w-[450px] bg-zinc-800 rounded-lg'>
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <div
                className={`text-center flex flex-col justify-center h-[300px] bg-image bg-cover bg-black bg-opacity-50 bg-blend-overlay rounded-t-lg ease-in duration-200 ${
                  isDragActive ? "bg-day" : "bg-night"
                }`}
              >
                {!isDragActive && (
                  <h4 className='w-[250px] p-6 rounded-lg mx-auto border-dashed border-4 border-zinc-400'>
                    Drop image here *
                  </h4>
                )}
              </div>

              <div className='text-center flex flex-col justify-center h-[115px] text-xs leading-4 tracking-wide text-white font-bold'>
                <p className='flex mx-auto items-center cursor-pointer'>
                  <span className='mr-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      class='w-6 h-6'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z'
                        clip-rule='evenodd'
                      />
                    </svg>
                  </span>
                  Choose Photo/Image
                </p>
                <br />
              </div>
            </div>
          </div>
          <p className='text-[0.6rem] mx-auto text-center p-4'>
            Day Night Van by{" "}
            <span className='text-green-500'>Zirconicusso</span> on{" "}
            <span className='text-green-500'>Freepik</span>
          </p>
        </div>
      ) : (
        <div className='flex'>
          <div className='mx-auto pb-4 w-[450px] bg-zinc-800 rounded-lg  ease-in duration-300 transition-all'>
            <Image
              className='rounded-t-lg'
              width={450}
              height={450}
              src={image}
            />
            <div className='text-center flex flex-col justify-center   text-xs leading-4 tracking-wide text-white font-bold'>
              <h4 className='py-4 mb-6 bg-zinc-700 text-sm'>Share Options</h4>
              <h4 className='text-left mx-6 tracking-wide'>Share Link</h4>
              <div className='flex justify-center py-2'>
                <p className='bg-zinc-900 p-3 rounded-l w-[320px] overflow-auto scrollbar-hide'>
                  {!link ? `...loading` : `${link}`}
                </p>
                <button
                  disabled={!link}
                  onClick={() => {
                    navigator.clipboard.writeText(link);
                    callShare();
                  }}
                  className=' text-black font-bold bg-green-500 w-[92px] px-4 rounded-r disabled:bg-zinc-500'
                >
                  {share ? "Copied!" : "Copy link"}
                </button>
              </div>

              <h4 className='mt-2 text-left mx-6 tracking-wide'>
                BBCode (Forums)
              </h4>
              <div className='flex justify-center py-2'>
                <p className='bg-zinc-900 p-3 rounded-l w-[320px] overflow-auto scrollbar-hide'>
                  {!link ? `...loading` : `[img]${link}[/img]`}
                </p>
                <button
                  disabled={!link}
                  onClick={() => {
                    navigator.clipboard.writeText(`[img]${link}[/img]`);
                    callShare();
                  }}
                  className=' text-black font-bold bg-green-500 w-[92px] px-4 rounded-r disabled:bg-zinc-500'
                >
                  {share ? "Copied!" : "Copy link"}
                </button>
              </div>
              <h4 className='mt-2 text-left mx-6 tracking-wide'>
                Markdown (Reddit)
              </h4>
              <div className='flex justify-center py-2'>
                <p className='bg-zinc-900 p-3 rounded-l whitespace-nowrap w-[320px] overflow-auto scrollbar-hide'>
                  {!link ? `...loading` : `[web3imgur](${link})`}
                </p>
                <button
                  disabled={!link}
                  onClick={() => {
                    navigator.clipboard.writeText(`[web3imgur](${link})`);
                    callShare();
                  }}
                  className='text-black font-bold bg-green-500 w-[92px] px-4 rounded-r disabled:bg-zinc-500'
                >
                  {share ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>
          </div>
          {!hasMinted ? (
            <div className='mx-8 bg-zinc-800 rounded p-10 h-fit'>
              <h1 className='font-bold mb-6 text-lg'>GENERATE NFT</h1>
              <p className='mb-8'>
                Mint your image as
                <br /> an NFT on Polygon.
              </p>
              <div className='flex flex-col justify-between h-[240px]'>
                <h2>Title</h2>
                <input
                  className='text-black rounded px-2'
                  onChange={(e) => setTitle(e.target.value)}
                />
                <h2>Description</h2>
                <textarea
                  className='text-black rounded px-2'
                  onChange={(e) => setDescription(e.target.value)}
                />
                <br />
                <ConnectButton />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    write?.();
                  }}
                >
                  {isConnected && (
                    <button
                      disabled={!write || txLoading || isLoading}
                      type='submit'
                      className='text-black font-bold bg-green-500 w-[192px] text-center px-4 py-2 mt-4 rounded disabled:bg-zinc-500'
                    >
                      {isLoading && `Sign tx...`}
                      {txLoading && `Minting`}
                      {!isLoading && !txLoading && `Mint`}
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div className='mx-8 bg-zinc-800 rounded p-10 h-fit'>
              <h1 className='font-bold mb-6 text-lg'>SUCCESS!</h1>
              <p className='mb-8'>
                You have succesfully minted
                <br /> your image as an NFT.
              </p>
              <p>View your NFT on Opensea </p>
              <br />
              <p>-- or --</p>
              <Link href='./feed'>
                <button className='text-black font-bold bg-green-500 w-[192px] px-4 py-2 mt-4 rounded disabled:bg-zinc-500'>
                  VISIT FEED
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
