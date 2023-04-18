'use client'
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Link from 'next/link';
import React from "react";
import {useRouter} from "next/router";
import PostCreate from "./src/post/PostCreate";
import GetPost from "./src/post/GetPost";
import PostList from "./src/post/PostList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <div className="flex justify-center items-center left-3 xl:pr-16">
        <PostList />
    </div>
  );
}
