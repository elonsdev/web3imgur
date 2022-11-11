import { getAllNFT } from "../lib/moralis";
import { useState } from "react";
import Image from "next/image";

export default function Feed() {
  const [imagesList, setImagesList] = useState();

  const NFTs = async () => {
    const result = await getAllNFT();
    console.log(result);
    setImagesList(
      result.map((img, i) => (
        <div className='' key={i}>
          <div className='p-2'>
            <h4 className='p-4 font-bold text-xl'>{img._data.metadata.name}</h4>
            <Image height={200} width={300} src={img._data.metadata.image} />
            <p className='p-4 '>{img._data.metadata.description}</p>
          </div>
        </div>
      ))
    );
  };

  if (!imagesList) {
    NFTs();
  }

  return (
    <div className='w-[950px] mx-auto mt-[10vh]'>
      <ul className='flex flex-wrap fl'>{imagesList}</ul>
    </div>
  );
}
