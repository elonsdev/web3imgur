import { useState } from "react";

export default function PostManager() {
  const [title, setTitle] = useState("");

  return (
    <div className='mx-2 px-20'>
      <h1>POST</h1>
    </div>
  );
}
