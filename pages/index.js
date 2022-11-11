import Head from "next/head";
import Image from "next/image";
import Logo from "/public/logo.png";
import DropManager from "../components/DropManager";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className='flex justify-center flex-col mt-[15vh]'>
        <DropManager />
      </div>

      <div></div>
    </div>
  );
}
