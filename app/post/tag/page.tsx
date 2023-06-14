'use client'
import { Inter } from "next/font/google";
import React from "react";
import PostList from "../PostList";

const inter = Inter({ subsets: ["latin"] });

export default function Page({params}:{params : {tagName: string}}) {
    const {tagName} = params;
    console.log(tagName)
    return (
        <div>
            <PostList  params=''/>
        </div>
    );
}