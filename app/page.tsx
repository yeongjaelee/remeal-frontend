'use client'
import { Inter } from "next/font/google";
import React, {useEffect} from "react";
import PostList from "./post/PostList";
import Counter from "./Counter";
import {useRouter} from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const router = useRouter()
    useEffect(()=>{console.log(1);router.refresh()},[])
  return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
    <div>
        <PostList params='' />
    </div>
  );
}
