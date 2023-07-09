/* eslint-disable */
'use client'
import React, {useEffect, useRef, useState} from "react";
import client from "../../../apollo-client";
import PostService from "../../data/post";
import { useSearchParams, useRouter } from 'next/navigation';
import {faChevronDown, faChevronUp, faCommentDots, faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Layout from "./layout";
import CommentsBar from "../../components/CommentsBar";
import LoginModal from "../../nav/login/LoginModal";
import Link from "next/link";
import "react-quill/dist/quill.core.css";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

import ReactTimeAgo from "react-time-ago";
import Image from 'next/image';

export default function Page() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [datetime, setDatetime] = useState<string>()
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id'));
    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState<any>(null)
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
    const [likeNumber, setLikeNumber] = useState<number>(0)
    const [isLike, setIsLike] = useState<boolean>(false)
    const [userImage, setUserImage] = useState<string>('')
    const [isUserImageDeleted, setIsUserImageDeleted] = useState<boolean>(false)
    const [isMine, setIsMine] = useState<boolean>(false)
    async function callPost() {
        const token = localStorage.getItem('token')
        if (token){
            const {data} = await client.query({query: PostService.getPostUser, variables: {'id': id, 'token':token}})
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
            setLikeNumber(data.post.likeNumber)
            if(data.post.isLikeUser){
                setIsLike(data.post.isLikeUser.isLike)
            }
            setIsMine(data.post.isMine)
        }
        else{
            const {data} = await client.query({query: PostService.getPost, variables: {'id': id}})
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
            setLikeNumber(data.post.likeNumber)
        }
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
    async function clickLike(){
        const token = localStorage.getItem('token')
        if (token){
            const {data} = await client.mutate({mutation:PostService.likeOnPost, variables:{'token': token, 'postId':id, 'isLike':!isLike}})
            setIsLike(data.likeOnPostMutation.isLikeResult)
            setLikeNumber(data.likeOnPostMutation.likeNumber)
        }
        else{
            alert('로그인 부탁드립니다')
            setShowModal(true)
        }
    }
    useEffect(() => {
            callPost()
            getComments()
            setTimeout(()=>setShowComment(true))

        },[]
    )
    // @ts-ignore
    async function createComment(e) {
        e.preventDefault()
        setComment(comment)
        console.log('create comment')

        const token = localStorage.getItem('token')
        if (token){
            if(comment.length === 0){
                alert('내용을 입력해주세요')
            }
            else{
                const {data} = await client.mutate({mutation: PostService.createComment, variables:{'token':token, 'postId':id, 'comment':comment}})
                // setComments([...comments, { data.co }])
                setComments(data.createComment.comments)
                setComment('')
            }

        }
        else{
            alert('로그인 부탁드립니다')
            setShowModal(true)
        }


    }
    return(
        /* eslint-disable */
        <div className="relative flex flex-col items-center justify-center ">
            <div className="mt-8 flex ">
                <p className="text-3xl">{title}</p>
            </div>
            <div className="w-3xl">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-end">
                        <div>
                            <Link href={`../profile/[email]?email=${email}`} className="font-normal font-mono font-light">{email}</Link>
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
                    <div>
                        {isMine?<Link href={`../post/postCreate?id=${id}`} className="font-NanumSquareNeoOTF-rg font-normal mr-1">
                                    수정하기
                                </Link>:""}
                    </div>
                </div>

                <div className="h-1"></div>
                <div className="border border-gray-400"></div>
                <div className="h-5"></div>

                <div className="view ql-editor" dangerouslySetInnerHTML={{__html : content}}/>
                <div className="h-5"></div>

                <div className="flex flex-wrap w-96">
                    {tags.map((tag:any, index)=>{
                        return(
                            /* eslint-disable */
                            // @ts-ignore
                            <div key={tag.id} >

                                <Link
                                    // @ts-ignore
                                    href={`../../post/tag?tagName=${tag.name}`}
                                    className="h-7 rounded-lg bg-gray-100 h-7 mr-2 mt-2 rounded-2xl bg-gray-100 opacity-75 flex items-center justify-center content-center">
                                    <p className="font-NanumSquareNeoOTF-rg font-normal text-xs leading-5 ml-2 mr-2"># {tag.name}</p>
                                </Link>
                            </div>
                            /* eslint-enable */
                        )
                    })}
                </div>
                <div className="h-5"></div>
                <div className="flex flex-row">
                    <div className="flex flex-row items-center">
                        <div className="w-3"></div>
                        <button onClick={clickLike}>
                            {isLike?
                                <FontAwesomeIcon icon={faHeart} style={{color: "#f70202",}} className="mr-0.5" />
                                :
                                <FontAwesomeIcon icon={faHeart} style={{color: "#dbdfe6",}} className="mr-0.5"/>
                            }
                        </button>
                        <div className="ml-1">{likeNumber}</div>
                    </div>
                    {/*<button className="flex flex-row" onClick={()=>setShowComment(!showComment)}>*/}
                    {/*    <FontAwesomeIcon icon={faCommentDots} style={{color: "#04090b",}} className="m-1"/>*/}
                    {/*    <div>*/}
                    {/*        {commentLength}*/}
                    {/*    </div>*/}
                    {/*</button>*/}
                </div>
                <div className="h-96"></div>
                <div className={`fixed w-96 inset-y-0 overflow-hidden ${showComment ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"} top-0 right-0 z-[999] h-full bg-gray-200 text-black transition-opacity transition-transform duration-500 ease-out overflow-y-scroll`}>
                    <div className="mt-6 ml-8 mb-6">
                        <p className="text-xl font-bold">Responses ({comments?.length})</p>
                    </div>
                    <form onSubmit={createComment} className="flex flex-col justify-center items-center">
                        <div className="w-80 h-8 bg-white flex items-center justify-center rounded-md drop-shadow-lg">
                            <div className="w-72">
                                <input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="당신의 생각은 무엇인가요?" className="outline-0"/>
                            </div>
                        </div>
                    </form>
                    <div className="h-8"></div>
                    <div className="border border-white"></div>
                    {comments?
                        <div className="w-3xl">
                            <div className="h-5"></div>
                            <div className="flex flex-col">
                                {comments.map((item:any, index:number)=>(
                                        <div key={item.id} className="w-80 ml-8">
                                            <div className="flex flex-row">
                                                {item.userImage && !item.userImage.isDeleted?
                                                    //<Link href={`../profile/[email]?email=${item.user.email}`} className="font-normal font-mono underline underline-offset-3">{item.user.email}</Link>
                                                    <Link href={`../profile/[email]?email=${item.user.email}`} className="relative rounded-full w-8 h-8 flex items-center justify-center mt-1 mr-3 ">
                                                        <img src={item.userImage.image} className="rounded-full w-full h-full object-cover" alt=""/>
                                                    </Link>:
                                                    <Link href={`../profile/[email]?email=${item.user.email}`} className="relative rounded-full w-8 h-8 bg-emerald-700 flex items-center justify-center mt-1 mr-3 ">
                                                        <p className="text-gray-100 flex items-center justify-center mb-0.5 text-base">{item.user.email[0]}</p>
                                                    </Link>
                                                }
                                                <div className="flex flex-col">
                                                    <div>
                                                        <Link href={`../profile/[email]?email=${item.user.email}`} className="text-x">{item.user.email}</Link>
                                                    </div>
                                                    <ReactTimeAgo date={new Date(item.dateCreated)} className="text-xs font-light text-gray-400"></ReactTimeAgo>
                                                </div>

                                            </div>
                                            <div className="flex flex-col">
                                                <div className="h-2"></div>
                                                <p className="text-base ml-1">{item.comment}</p>
                                                <div className="h-6"></div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                            </div>:''
                    }
                </div>
            </div>
            <LoginModal
                onClose={() => setShowModal(false)}
                show={showModal}
            >
                Hello from the modal!
            </LoginModal>
        </div>

    )
}