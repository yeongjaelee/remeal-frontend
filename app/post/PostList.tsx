
'use client'
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import PostService from "../data/post";
import Link from "next/link";
// @ts-ignore
import { debounce } from 'lodash';
import {useDispatch, useSelector} from "react-redux";
import {RootSate} from "../GlobalRedux/store";
import {incrementLimit, incrementOffset, initialLimit, initialOffset} from "../GlobalRedux/Features/tagSlice";
import {useSearchParams, useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag, faShareFromSquare} from "@fortawesome/free-solid-svg-icons";
import LoginModal from "../nav/login/LoginModal";
import ShareModal from "../components/ShareModal";
import client from "../../apollo-client";

// @ts-ignore
export default function PostList (params:any){
    const searchParams = useSearchParams();
    const router = useRouter()
    const tagName = searchParams.get('tagName')
    const [postList, setPostList] = useState([])
    const [pageLoaded, setPageLoaded] = useState(false);
    const containerRef = useRef(null);
    const [isFetching, setIsFetching] = useState<boolean>(false)
    // const limit = useSelector((state:RootSate)=>state.tag.limit)
    // const offset = useSelector((state:RootSate)=>state.tag.offset)
    const [limit, setLimit] = useState<number>(4)
    const [offset, setOffset] = useState<number>(0)
    const dispatch = useDispatch();
    const [checkSame, setCheckSame] = useState<boolean>(false)
    // const [searchTag, setSearchTag] = useState<string>(params.tagName)
    const [showModal, setShowModal] = useState(false);
    const [copyUrl, setCopyUrl] = useState<string>('')
    const email = params
    const fetchData = async () => {
        console.log(tagName)
        if (email.params==='all'){
            console.log('limit')
            console.log(limit)
            console.log('offset')
            console.log(offset)
            const {data} = await client.query({query: PostService.getPostList, variables:{'limit':limit, 'tagName':tagName, 'offset':offset, 'email':null}})
            console.log(data.postList)
            if (data.postList.length>0){
                // @ts-ignore
                setPostList([...postList, ...data.postList]);
                console.log('data fetching')
            }
            else{
                setCheckSame(true)
            }
        }
        else {
            console.log('limit')
            console.log(limit)
            console.log('offset')
            console.log(offset)
            const {data} = await client.query({query: PostService.getPostList, variables:{'limit':limit, 'tagName':tagName, 'offset':offset, 'email':email.params}})
            console.log(data.postList)
            if (data.postList.length>0){
                // @ts-ignore
                setPostList([...postList, ...data.postList]);
                console.log('data fetching')
            }
            else{
                setCheckSame(true)
            }
        }
    };
    // @ts-ignore
    function removeImages(str) {
        if (!str) {
            return '';
        }
        // Replace image tags with an empty string
        const htmlWithoutImages = str.replace(/<img[^>]*>/g, '');
        let stringWithoutHtml = htmlWithoutImages.replace(/(<([^>]+)>)/gi, '');
        let truncatedHtml = htmlWithoutImages;
        if (stringWithoutHtml.length > 150) {
            // If the length of the text content is greater than 100, truncate the HTML and add an ellipsis
            // @ts-ignore
            const truncatedText = stringWithoutHtml.slice(0, 150) + ' ...';
            // truncatedHtml = htmlWithoutImages.replace(stringWithoutHtml, truncatedText + '...');
            stringWithoutHtml = truncatedText
        }
        // Convert the string to HTML
        const html = {__html: truncatedHtml};
        // Render the HTML with the dangerouslySetInnerHTML property
        return stringWithoutHtml
        // return <div dangerouslySetInnerHTML={html} className="font-light text-xs" />;
    }
    useEffect(() => {
        console.log('okok')
        fetchData();
    },[limit]);

    // useEffect(() => {
    //     if (!pageLoaded) {
    //         console.log(1111)
    //         setPageLoaded(true);
    //         const currentURL = window.location.href;
    //         window.history.replaceState(null, '', currentURL);
    //     }
    // }, [dispatch, router, setPostList, pageLoaded]);

    useEffect(() => {
        const handleScroll = debounce(() => {
            // @ts-ignore
            const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
            if (scrollTop + clientHeight === scrollHeight && !isFetching && !checkSame) {
                setIsFetching(true);
                console.log('isfetching true')
                window.scrollTo({
                    top: scrollTop - 20,
                    behavior: "smooth",
                });
                setTimeout(() => {
                    // setOffset(limit);
                    // setLimit(limit + 4);
                    // dispatch(incrementLimit())
                    // dispatch(incrementOffset())
                    // @ts-ignore
                    const newScrollHeight = containerRef.current.scrollHeight;
                    // @ts-ignore
                    containerRef.current.scrollTo({
                        top: newScrollHeight - 20,
                        behavior: "smooth",
                    });

                    setIsFetching(false);
                    console.log('isfetching false')
                }, 10);
            }
        }, 10); // debounce with 500ms delay

        const container = containerRef.current;
        if (container) {
            // @ts-ignore
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const container = containerRef.current;
            if (container) {
                // @ts-ignore
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [isFetching]);
    //
    function handleCopyClipBoard(postId: number) {
        //http://localhost:3000/post/[id]?id=12
        const url = `https://www.re-meal.com/post/[id]?id=${postId}`;
        setCopyUrl(url)
        setShowModal(true)
    }
    return(
        <div ref={containerRef} className="flex flex-col justify-center items-center left-3  h-screen overflow-y-scroll">
            <div className="w-screen flex items-center justify-center">
                <div className="flex flex-col h-screen w-2xl ">
                    <div className="flex flex-row items-center justify-center ">
                        {/*<input value={searchTag ||''} onChange={(e)=>setSearchTag(e.target.value)} className="bg-gray-200 border-gray-400 border-2 mb-1 w-56" placeholder="검색할 해시태그를 입력하세요"/>*/}
                        {tagName?<div className="flex items-center justify-end mt-12 text-4xl">
                            <FontAwesomeIcon icon={faHashtag} style={{color: "#02060d",}} />
                            &nbsp;{tagName}
                        </div>:''}
                    </div>
                    <div className="mt-12 flex flex-col items-center justify-center">
                        {postList.map((item:any, index) => {
                            // @ts-ignore
                            const contentLettersOnly = removeImages(item.content);
                            // @ts-ignore
                            const tags = item.tagsOnPost;
                            return (
                                // @ts-ignore
                                <div key={item.id} className="bg-white flex flex-col w-2xl mb-16">
                                    <div className="h-4"></div>
                                    <div className="flex flex-row items-end content-center place-items-center h-10">
                                        <div className="pl-4 rounded-full bg-green-400 w-5 h-5"></div>
                                        <div className="w-2"></div>
                                        <div>

                                            <Link href={`../profile/[email]?email=${item.user.email}`} className="font-normal font-mono underline underline-offset-3">{item.user.email}</Link>
                                        </div>
                                        <div className="w-1"></div>
                                        <div className="flex items-center ">.</div>
                                        <div className="w-1"></div>
                                        <div className="flex flex-row w-20 h-4.5 justify-between">
                                            <div className="text-xs font-normal text-gray-700 text-xs " >{item.dateCreatedYear}.</div>
                                            <div className="text-xs font-normal text-gray-700 text-xs">{item.dateCreatedMonth}.</div>
                                            <div className="text-xs font-normal text-gray-700 text-xs">{item.dateCreatedDay}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row justify-between">
                                        <div>
                                            <div className="flex flex-row">
                                                <div className="w-4"></div>
                                                <Link href={`../post/[id]?id=${item.id}`} className="w-96 mt-4">
                                                    <p className="text-xl font-bold font-NanumSquareNeoOTF-rg">{item.title}</p>
                                                </Link>
                                            </div>
                                            <div className="h-4"></div>
                                            <div className="flex flex-row h-24">
                                                <div className="w-4"></div>
                                                <div className="w-80 font-light text-xs leading-5 flex flex-wrap">
                                                    <Link href={`../post/[id]?id=${item.id}`} className="font-NanumSquareNeoOTF-rg font-normal text-lg leading-5 text-gray-700 w-80 flex flex-wrap">
                                                        <div>{contentLettersOnly.slice(0,50)}</div>
                                                        <div>{contentLettersOnly.slice(51,100)}</div>
                                                        <div>{contentLettersOnly.slice(101,153)}</div>
                                                    </Link>
                                                </div>
                                                <div className="w-20"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <Link href={`../post/[id]?id=${item.id}`}>
                                                {item.firstPostImage?
                                                    <img src={item.firstPostImage?.image} alt={item.firstPostImage} width="120" height="120" />
                                                    :''
                                                }
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="h-10"></div>
                                    <div className="flex">
                                        <div className="w-3"></div>
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-wrap w-96">
                                                {tags.map((tag:any, index:number)=>{
                                                    return(
                                                        <div key={tag.id} className="mb-2" >
                                                            <div className="mr-1 h-7 rounded-2xl bg-gray-200 opacity-75 flex items-center justify-center">
                                                                <Link
                                                                    href={`../../post/tag?tagName=${tag.name}`}
                                                                    className="font-NanumSquareNeoOTF-rg font-normal text-xs leading-5 ml-3 mr-3">
                                                                    <a># {tag.name}</a>
                                                                </Link>
                                                            </div>
                                                            {index+1%3 == 0 &&<br/>}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {/*{tags.length === 0 && <div className="w-20"></div>}*/}
                                            <div className="w-10"></div>
                                            <div>
                                                <div className="h-1"></div>
                                                <button onClick={()=>handleCopyClipBoard(item.id)}>
                                                    <FontAwesomeIcon icon={faShareFromSquare} style={{color: "#8e9cb4",}} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        })}
                        {/*{isFetching?<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" width="100" height="100" />:''}*/}
                    </div>
                    <div>
                    </div>

                    <ShareModal
                        onClose={() => setShowModal(false)}
                        show={showModal}
                    >
                        {copyUrl}
                    </ShareModal>
                </div>
            </div>
        </div>
    )
}