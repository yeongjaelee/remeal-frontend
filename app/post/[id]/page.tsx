'use client'
import React, {useEffect, useRef, useState} from "react";
import client from "../../../apollo-client";
import PostService from "../../data/post";
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import {faChevronDown, faChevronUp, faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Page() {
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [datetime, setDatetime] = useState<string>()
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id'));
    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState([])
    const [email, setEmail] = useState<string>('')
    const [year, setYear] = useState<string>('')
    const [month, setMonth] = useState<string>('')
    const [day, setDay] = useState<string>('')
    const [hour, setHour] = useState<string>('')
    const [minute, setMinute] = useState<string>('')
    const [isComment, setIsComment] = useState<boolean>(false)
    const [tags, setTags] = useState([])
    async function callPost() {
        const {data} = await client.query({query: PostService.getPost, variables: {id: id}})
        setTitle(data.post.title)
        setContent(data.post.content)
        setDatetime(data.post.dateCreated)
        setEmail(data.post.user.email)
        setYear(data.post.dateCreatedYear)
        setMonth(data.post.dateCreatedMonth)
        setDay(data.post.dateCreatedDay)
        setHour(data.post.dateCreatedHour)
        setMinute(data.post.dateCreatedMinute)
        setTags(data.post.tagsOnPost)
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
            <div className="mt-8 flex ">
                <p className="text-3xl">{title}</p>
            </div>
            <div className="w-3xl">
                <div className="flex flex-row mt-5 items-end">
                    <div>
                        <p className="font-light">{email}</p>
                    </div>
                    <div className="w-5"></div>
                    <div>
                        <p className="font-light text-xs text-gray-400">{year}</p>
                    </div>

                    <div>
                        <p className="font-light text-xs text-gray-400">.{month}</p>
                    </div>
                    <div>
                        <p className="font-light text-xs text-gray-400">.{day}</p>
                    </div>
                    <div className="w-2"></div>
                    <div>
                        <p className="font-light text-xs text-gray-400">{hour}</p>
                    </div>
                    <div>
                        <p className="font-light text-xs text-gray-400">:{minute}</p>
                    </div>
                </div>

                <div className="h-5"></div>
                <div className="border border-gray-400"></div>
                <div className="h-5"></div>

                <div dangerouslySetInnerHTML={{__html : content}}/>
                <div className="h-5"></div>
                <div className="flex flex-row">
                    {tags.map((tag, index)=>{
                        return(
                            <div key={tag.id} className="w-20" >
                                <div className="w-16 h-7 rounded-lg bg-gray-100">
                                    <div className="flex items-center justify-center content-center">
                                            {tag.name}

                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
                <div className="h-5"></div>
                <div className={isComment?'w-28 h-6 border border-pink-600 flex flex-row items-center justify-between':"w-28 h-6 border border-gray-400 flex flex-row items-center justify-between"}>
                    <FontAwesomeIcon icon={faCommentDots} style={{color: "#04090b",}} className="m-1"/>
                    <div>
                        댓글
                    </div>
                    <div>
                        {comments.length}
                    </div>
                    <div className="h-4 border border-gray-400 outline-1"></div>
                    {isComment?
                        <button onClick={()=>setIsComment(false)}>
                            <FontAwesomeIcon icon={faChevronDown} style={{color: "#05070b",}} />
                        </button>
                        :
                        <button onClick={()=>setIsComment(true)}>
                            <FontAwesomeIcon icon={faChevronUp} style={{color: "#05070b",}} />
                        </button>

                    }
                    <div className="w-1"></div>
                </div>

                <div className="h-5"></div>
                {isComment?
                    <div className="w-3xl h-3xl bg-gray-300 overflow-y-scroll">
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
                        </form></div>:''
                }


                <div className="h-48"></div>
            </div>

        </div>
    )
}