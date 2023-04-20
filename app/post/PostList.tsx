'use client'
import React,{useEffect, useState} from "react";
import auth_client from "../../auth-client";
import PostService from "../data/post";
import Link from "next/link";

export default function PostList (){
    const [postList, setPostList] = useState([])
    function removeImages(str) {
        if (!str) {
            return '';
        }
        // Replace image tags with an empty string
        const stringWithoutImages = str.replace(/<img[^>]*>/g, '');

        // Convert the string to HTML
        const html = {__html: stringWithoutImages};

        // Render the HTML with the dangerouslySetInnerHTML property
        return <div dangerouslySetInnerHTML={html} />;
    }
    async function GetPostList() {
        const {data} = await auth_client.query({query: PostService.getPostList})
        setPostList(data.postList)
    }
    useEffect(()=>{
            GetPostList()
        },[]
    )
    return(
        <div className="flex">
            <div className="bg-white w-xl">
                {postList.map((item, index) => {
                    const titleLettersOnly = removeImages(item.content);
                    return (
                        <div key={item.id} className="flex flex-row border-b-4 border-indigo-500 h-64">
                            <div className="w-72">
                                <Link href={`../post/[id]?id=${item.id}`}>{item.title}</Link>
                                {titleLettersOnly}
                            </div>
                            <div className="justify-end">
                                {item.firstPostImage?
                                    <img src={item.firstPostImage?.image} alt={item.firstPostImage} width="200" height="100"/>
                                    :''
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
            <div>
                <Link href="../post/postCreate">post create</Link>
            </div>
        </div>
    )
}