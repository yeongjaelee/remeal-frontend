'use client'
import React, {useEffect, useRef, useState} from "react";
import client from "../../../apollo-client";
import PostService from "../../data/post";
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import {faChevronDown, faChevronUp, faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Layout from "./layout";
import CommentsBar from "../../components/CommentsBar";
import LoginModal from "../../nav/login/LoginModal";

export default function Page() {
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [datetime, setDatetime] = useState<string>()
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id'));
    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState(null)
    const [email, setEmail] = useState<string>('')
    const [year, setYear] = useState<string>('')
    const [month, setMonth] = useState<string>('')
    const [day, setDay] = useState<string>('')
    const [hour, setHour] = useState<string>('')
    const [minute, setMinute] = useState<string>('')
    const [isComment, setIsComment] = useState<boolean>(false)
    const [tags, setTags] = useState([])
    const [commentLength, setCommentLength] = useState<number>(0)
    const [showComment, setShowComment] = useState<boolean>(false)
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
        if (data){
            setComments(data.comments)
            setCommentLength(data.comments.length)
        }
        else{
            setCommentLength(0)
        }

    }
    useEffect(() => {
            callPost()
            getComments()
            setTimeout(()=>setShowComment(true))

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
        <div className="relative flex flex-col items-center justify-center overflow-y-scroll">
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
                <div className="flex flex-row">
                    <button className="flex flex-row" onClick={()=>setShowComment(!showComment)}>
                        <FontAwesomeIcon icon={faCommentDots} style={{color: "#04090b",}} className="m-1"/>
                        <div>
                            {commentLength}
                        </div>
                    </button>
                </div>
                <div className="h-96"></div>

                <div className={`fixed w-96 inset-y-0 overflow-hidden ${showComment ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"} top-0 right-0 z-[999] h-full bg-gray-200 text-black transition-opacity transition-transform duration-500 ease-out overflow-y-scroll`}>
                    <div className="mt-6 ml-8 mb-6">
                        <p className="text-xl font-bold">Responses ({comments?.length})</p>
                    </div>
                    <form onSubmit={createComment} className="flex flex-col justify-center items-center">
                        <div className="w-80 h-8 bg-white flex items-center justify-center rounded-md drop-shadow-lg">
                            <div className="w-72">
                                <input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="당신의 생각은 무엇인가요?"/>
                            </div>
                        </div>
                    </form>
                    <div className="h-8"></div>
                    <div className="border border-white"></div>
                    {comments?
                        <div className="w-3xl">
                            <div className="h-5"></div>
                            <div className="flex flex-col">
                                {comments.map((item, index)=>(
                                        <div key={item.id} className="w-80 h-12 ml-8">
                                            {item.comment}
                                        </div>
                                    )
                                )}
                            </div>
                            </div>:'아직 댓글이 없습니다'
                    }
                </div>
            </div>
        </div>
    )
}