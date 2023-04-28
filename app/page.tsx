'use client'
import { Inter } from "next/font/google";
import React from "react";
import PostList from "./post/PostList";
import Counter from "./Counter";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <div>
        <PostList />
    </div>
  );
}
