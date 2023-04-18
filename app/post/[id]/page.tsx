'use client'
import React, {useEffect, useState} from "react";
import client from "../../../apollo-client";
import PostService from "../../data/post";
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';


export default function Page() {
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [datetime, setDatetime] = useState<string>()
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id'));
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
        <div>
            {title}
            <div dangerouslySetInnerHTML={{__html : content}}/>
            {datetime}
        </div>
    )
}