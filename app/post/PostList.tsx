'use client'
import React, {useEffect, useRef, useState} from "react";
import auth_client from "../../auth-client";
import PostService from "../data/post";
import Link from "next/link";
import { debounce } from 'lodash';
import {useDispatch, useSelector} from "react-redux";
import {RootSate} from "../GlobalRedux/store";
import {incrementLimit, incrementOffset, initialLimit, initialOffset} from "../GlobalRedux/Features/tagSlice";
import {useSearchParams, useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag, faShareFromSquare} from "@fortawesome/free-solid-svg-icons";
import LoginModal from "../nav/login/LoginModal";
import ShareModal from "../components/ShareModal";


export default function PostList (params){
    const searchParams = useSearchParams();
    const router = useRouter()
    const tagName = searchParams.get('tagName')
    const [postList, setPostList] = useState([])
    const containerRef = useRef(null);
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const limit = useSelector((state:RootSate)=>state.tag.limit)
    const offset = useSelector((state:RootSate)=>state.tag.offset)
    const dispatch = useDispatch();
    const [checkSame, setCheckSame] = useState<boolean>(false)
    const [searchTag, setSearchTag] = useState<string>(params.tagName)
    const [showModal, setShowModal] = useState(false);
    const [copyUrl, setCopyUrl] = useState<string>('')
    const fetchData = async () => {
        console.log(tagName)
        const {data} = await auth_client.query({query: PostService.getPostList, variables:{'limit':limit, 'tagName':tagName, 'offset':offset}})
        console.log(data.postList)
        if (data.postList.length>0){
            setPostList([...postList, ...data.postList]);
            console.log('data fetching')
        }
        else{
            setCheckSame(true)
        }
    };
    function removeImages(str) {
        if (!str) {
            return '';
        }
        // Replace image tags with an empty string
        const htmlWithoutImages = str.replace(/<img[^>]*>/g, '');
        let stringWithoutHtml = htmlWithoutImages.replace(/(<([^>]+)>)/gi, '');
        let truncatedHtml = htmlWithoutImages;
        if (stringWithoutHtml.length > 100) {
            // If the length of the text content is greater than 100, truncate the HTML and add an ellipsis
            const truncatedText = stringWithoutHtml.slice(0, 100) + ' ...';
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
        fetchData();
    },[limit]);

    useEffect(() => {
        dispatch(initialLimit())
        dispatch(initialOffset())
        setPostList([])
        setSearchTag(tagName);
        router.refresh()
    }, [])

    useEffect(() => {
        const handleScroll = debounce(() => {
            const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
            if (scrollTop + clientHeight === scrollHeight && !isFetching && !checkSame) {
                setIsFetching(true);
                window.scrollTo({
                    top: scrollTop - 20,
                    behavior: "smooth",
                });
                setTimeout(() => {
                    // setOffset(limit);
                    // setLimit(limit + 4);
                    dispatch(incrementLimit())
                    dispatch(incrementOffset())
                    const newScrollHeight = containerRef.current.scrollHeight;
                    containerRef.current.scrollTo({
                        top: newScrollHeight - 20,
                        behavior: "smooth",
                    });
                    setIsFetching(false);
                }, 100);
            }
        }, 100); // debounce with 500ms delay

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            const container = containerRef.current;
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [isFetching]);
    //
    function handleCopyClipBoard(postId: number) {
        //http://localhost:3000/post/[id]?id=12
        const url = `http://localhost:3000/post/[id]?id=${postId}`;
        setCopyUrl(url)
        setShowModal(true)
    }
    return(
        <div ref={containerRef} className="flex flex-col justify-center items-center left-3  h-screen overflow-y-scroll">
            <div className="w-screen flex items-center justify-center">
                <div className="flex flex-col h-screen w-xl ">
                    <div className="flex flex-row items-center justify-center ">
                        {/*<input value={searchTag ||''} onChange={(e)=>setSearchTag(e.target.value)} className="bg-gray-200 border-gray-400 border-2 mb-1 w-56" placeholder="검색할 해시태그를 입력하세요"/>*/}
                        {tagName?<div className="flex items-center justify-end mt-12 text-4xl">
                            <FontAwesomeIcon icon={faHashtag} style={{color: "#02060d",}} />
                            &nbsp;{tagName}
                        </div>:''}
                    </div>
                    <div className="h-screen mt-12 ">
                        {postList.map((item, index) => {
                            const contentLettersOnly = removeImages(item.content);
                            const tags = item.tagsOnPost;
                            return (
                                <div key={item.id} className="bg-white flex flex-col h-64">
                                    <div className="h-4"></div>
                                    <div className="flex flex-row items-end content-center place-items-center h-5">
                                        <div className="w-4"></div>
                                        <div className="pl-4 rounded-full bg-green-400 w-5 h-5"></div>
                                        <div className="w-2"></div>
                                        <div className="underline h-4.5">
                                            <p className="text-xs font-normal font-mono">{item.user.email}</p>
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
                                    <div className="h-4"></div>
                                    <div className="flex flex-row">
                                        <div className="w-4"></div>
                                        <Link href={`../post/[id]?id=${item.id}`} className="h-7 font-bold text-lg font-NanumSquareNeoOTF-rg">{item.title}</Link>
                                    </div>
                                    <div className="h-4"></div>
                                    <div className="flex flex-row h-24">
                                        <div className="w-4"></div>
                                        <div className="w-80 font-light text-xs leading-5">
                                            <Link href={`../post/[id]?id=${item.id}`} className="font-NanumSquareNeoOTF-rg font-normal text-xs leading-5 text-gray-700">{contentLettersOnly}</Link>
                                        </div>
                                        <div className="w-10"></div>
                                        <Link href={`../post/[id]?id=${item.id}`}>
                                            {item.firstPostImage?
                                                <img src={item.firstPostImage?.image} alt={item.firstPostImage} width="120" height="100" />
                                                :''
                                            }
                                        </Link>
                                    </div>
                                    <div className="h-4"></div>
                                    <div className="flex flex-row">
                                        <div className="w-4"></div>
                                        <div className="flex flex-row w-80 justify-between">
                                            <div className="flex flex-row">
                                                {tags.slice(0,3).map((tag, index)=>{
                                                    return(
                                                        <div key={tag.id} className="w-20" >
                                                            <div className="w-listOnTag h-7 rounded-2xl bg-gray-200 opacity-75 flex items-center justify-center">
                                                                <Link
                                                                    href={`../../post/tag?tagName=${tag.name}`}
                                                                    className="font-NanumSquareNeoOTF-rg font-normal text-xs leading-5">
                                                                    # {tag.name}
                                                                </Link>
                                                            </div>
                                                            <br />
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {tags.length === 0 && <div className="w-20"></div>}
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