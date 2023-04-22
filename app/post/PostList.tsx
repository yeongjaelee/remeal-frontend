'use client'
import React, {useEffect, useRef, useState} from "react";
import auth_client from "../../auth-client";
import PostService from "../data/post";
import Link from "next/link";

export default function PostList (){
    const [postList, setPostList] = useState([])
    const containerRef = useRef(null);
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [limit, setLimit] = useState<number>(4)
    const [offset, setOffset] = useState<number>(0)
    const [allNumber, setAllNumber] = useState<number>(0)
    const [checkSame, setCheckSame] = useState<boolean>(false)
    const Max_contents_length = 10
    const fetchData = async () => {
        console.log('limit')
        console.log(limit)
        const {data} = await auth_client.query({query: PostService.getPostList, variables:{'limit':limit}})
        const {data:allPost} = await auth_client.query({query: PostService.allPost})
        setPostList(data.postList);
        setAllNumber(allPost.allPost);
        if (data.postList.length == allPost.allPost){
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
        function handleScroll() {
            const {scrollHeight, scrollTop, clientHeight} = containerRef.current;
            // redux로 상태관리
            if (scrollTop + clientHeight === scrollHeight && !isFetching && !checkSame) {
                console.log('scrollTop')
                console.log(scrollTop)
                console.log('clientHeight')
                console.log(clientHeight)
                console.log('scrollHeight')
                console.log(scrollHeight)
                setIsFetching(true);
                console.log(1)
                setTimeout(() => {
                    console.log('222222222')
                    setLimit((prevLimit) => prevLimit + 4);
                    console.log('limit')
                    console.log(limit)
                    setIsFetching(false);
                }, 1000);
            }
        }
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

    return(
        <div className="flex flex-col">
            <div className="flex items-end justify-end m-1">
                <Link href="../post/postCreate" className="border-2 border-gray-400">글쓰기</Link>
            </div>
            <div ref={containerRef} className="w-xl overflow-y-scroll h-3xl">
                {postList.map((item, index) => {
                    const contentLettersOnly = removeImages(item.content);
                    const tags = item.tagsOnPost;
                    return (
                        <div key={item.id} className="bg-white flex flex-col border-b-2 border-gray-200 h-64">
                            <div className="h-4"></div>
                            <div className="flex flex-row items-center content-center place-items-center h-5">
                                <div className="w-4"></div>
                                <div className="pl-4 rounded-full bg-green-400 w-5 h-5"></div>
                                <div className="w-2"></div>
                                <div className="underline">
                                    {item.user.email}
                                </div>
                                <div className="w-1"></div>
                                <div className="w-2 flex items-center ">.</div>
                                <div className="w-1"></div>
                                <div className="flex flex-row w-20 justify-between">
                                    <div className="text-xs font-normal text-gray-700">{item.dateCreatedYear}.</div>
                                    <div className="text-xs font-normal text-gray-700">{item.dateCreatedMonth}.</div>
                                    <div className="text-xs font-normal text-gray-700">{item.dateCreatedDay}</div>
                                </div>
                            </div>
                            <div className="h-4"></div>
                            <div className="flex flex-row">
                                <div className="w-4"></div>
                                <Link href={`../post/[id]?id=${item.id}`}>{item.title}</Link>
                            </div>
                            <div className="h-4"></div>
                            <div className="flex flex-row h-24">
                                <div className="w-4"></div>
                                <div className="w-80 font-light text-xs">
                                    {contentLettersOnly}
                                </div>
                                <div className="ml-auto">
                                    {item.firstPostImage?
                                        <img src={item.firstPostImage?.image} alt={item.firstPostImage} width="96" height="96"/>
                                        :''
                                    }
                                </div>
                            </div>
                            <div className="h-4"></div>
                            <div className="flex flex-row">
                                <div className="w-4"></div>
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
                            </div>
                        </div>
                    )
                })}
                {isFetching?<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" width="50" height="50" />:''}
            </div>
            <div>

            </div>
        </div>
    )
}