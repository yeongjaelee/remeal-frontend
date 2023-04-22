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
    const fetchData = async () => {
        const {data} = await auth_client.query({query: PostService.getPostList, variables:{'limit':limit}})
        const {data:allPost} = await auth_client.query({query: PostService.allPost})
        setPostList(data.postList);
        setAllNumber(allPost.allPost);
        if (postList.length == allNumber){
            setCheckSame(true)
        }
    };

    function removeImages(str) {
        if (!str) {
            return '';
        }
        // Replace image tags with an empty string
        const stringWithoutImages = str.replace(/<img[^>]*>/g, '');
        // Convert the string to HTML
        const html = {__html: stringWithoutImages};
        // Render the HTML with the dangerouslySetInnerHTML property
        return <div dangerouslySetInnerHTML={html} />;
    }
    useEffect(() => {
        fetchData();
    },[limit]);
    useEffect(() => {
        function handleScroll() {
            const {scrollHeight, scrollTop, clientHeight} = containerRef.current;
            // redux로 상태관리
            if (scrollTop + clientHeight >= scrollHeight && !isFetching && !checkSame) {

                setIsFetching(true);
                setTimeout(() => {
                    setLimit((prevLimit) => prevLimit + 4);
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
                                <div className="w-80">
                                    {contentLettersOnly}
                                </div>
                                <div className="ml-auto">
                                    {item.firstPostImage?
                                        <img src={item.firstPostImage?.image} alt={item.firstPostImage} width="96" height="96"/>
                                        :''
                                    }
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