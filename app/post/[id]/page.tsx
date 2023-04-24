'use client'
import React, {useEffect, useRef, useState} from "react";
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
    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState([])
    async function callPost() {
        const {data} = await client.query({query: PostService.getPost, variables: {id: id}})
        setTitle(data.post.title)
        setContent(data.post.content)
        setDatetime(data.post.dateCreated)

    }
    async function getComments(){
        const {data} = await client.query({query:PostService.getComments, variables:{'postId':id}})
        setComments(data.comments)
    }
    useEffect(() => {
            callPost()
            getComments()
        },[]
    )
    async function createComment(e) {
        e.preventDefault()
        setComment(comment)
        console.log('create comment')
        const token = localStorage.getItem('token')
        const {data} = await client.mutate({mutation: PostService.createComment, variables:{'token':token, 'postId':id, 'comment':comment}})
        // setComments([...comments, { data.co }])
        setComments(data.createComment.comments)
        setComment('')

    }
    return(
        <div className="flex flex-col items-center justify-center overflow-y-scroll">
            <div>
                {title}
            </div>
            <div dangerouslySetInnerHTML={{__html : content}}/>
            <div className="flex flex-col">
                {comments.map((item, index)=>(
                        <div key={index}>
                            {item.comment}
                        </div>
                    )
                )}
            </div>
            <form onSubmit={createComment}>
                <input value={comment} onChange={(e)=>setComment(e.target.value)}/>
            </form>
        </div>
    )
}