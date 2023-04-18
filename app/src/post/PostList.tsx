'use client'
import React,{useEffect, useState} from "react";
import auth_client from "../../../auth-client";
import PostService from "../../data/post";

export default function PostList (){
    const [postList, setPostList] = useState([])
    async function GetPostList() {
        const {data} = await auth_client.query({query: PostService.getPostList})
        setPostList(data.postList)
    }
    useEffect(()=>{
            GetPostList()
        },[]
    )
    return(
        <div>
            {postList.map((item, index) => (
                <li key={item.id}>{item.title}</li>
            ))}
        </div>
    )
}