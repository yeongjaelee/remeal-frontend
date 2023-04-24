'use client'
import React, {useEffect, useState} from "react";
import client from "../../../apollo-client";
import PostService from "../../data/post";
import { useRouter } from 'next/router';


export default function GetPost(){
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [datetime, setDatetime] = useState<string>()
    const router = useRouter()
    const [id] = router.query
    async function callPost() {
        const {data} = await client.query({query: PostService.getPost, variables: {id: id}})
        console.log(data)
        setTitle(data.post.title)
        setContent(data.post.content)
        setDatetime(data.post.dateCreated)
    }
    useEffect(() => {
            callPost()
        }
    )
    return(
        <div className="flex flex-col items-center justify-center">
            <div>
                {title}
            </div>
            <div dangerouslySetInnerHTML={{__html : content}}/>
        </div>
    )
}