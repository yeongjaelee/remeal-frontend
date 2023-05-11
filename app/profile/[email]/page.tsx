'use client'

import {useEffect, useLayoutEffect, useRef, useState} from "react";
import React from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faImage} from "@fortawesome/free-solid-svg-icons";
import {ThemeProvider} from "@material-tailwind/react";
import {useSearchParams} from "next/navigation";
import client from "../../../apollo-client";
import UserService from "../../data/users";

export default function Page() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [isUserContent, setIsUserContent] = useState<boolean>(false)
    const [userOldContent, setUserOldContent] = useState<string>('')
    const [userOldImage, setUserOldImage] = useState<string>('') // content image
    const [userImage, setUserImage] = useState<string>('') // profile image
    const [isUserImageDeleted, setIsUserImageDelete] = useState<boolean>(false)
    const [isUserOldContent, setIsUserOldContent] = useState<boolean>(false)
    const [userContent, setUserContent] = useState<string>('')
    const searchParams = useSearchParams();
    const email = String(searchParams.get('email'));
    const [imageSrc, setImageSrc] = useState<string>('')
    const [image, setImage] = useState(null)
    const [line, setLine] = useState<number>(0)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const contentTextarea = useRef(null);
    const bottomArea = useRef(null);
    const imageInput = useRef(null);
    async function userData() {
        const {data} = await client.query({query: UserService.GetUserByEmail, variables:{'email':email}})
        if (data.getUserByEmail.userContent){
            if(data.getUserByEmail.userContent.content || data.getUserByEmail.userContent.image){
                setIsUserOldContent(true)
                setUserContent(data.getUserByEmail.userContent.content)
                setUserOldContent(data.getUserByEmail.userContent.content)
                setLine(data.getUserByEmail.userContent.content.split("\n").length)
                setUserOldImage(data.getUserByEmail.userContent.image)
                const imageUrl = "http://127.0.0.1:8000/media/" + data.getUserByEmail.userContent.image
                setUserOldImage(imageUrl)
                if (data.getUserByEmail.userContent.image){
                    setImageSrc("http://127.0.0.1:8000/media/" +data.getUserByEmail.userContent.image)
                }
                else{
                    setImageSrc(null)
                }
                setIsEdit(true)
            }
            else{
                setIsUserOldContent(false)
            }
        }
        if (data.getUserByEmail.userImage){
            setUserImage("http://127.0.0.1:8000/media/" +data.getUserByEmail.userImage.image)
            setIsUserImageDelete(data.getUserByEmail.userImage.isDeleted)
        }
        setUsername(data.getUserByEmail.username)
    }
    useEffect(()=>{
        userData()
    },[])

    return(
        <div className="flex justify-center">
            <div className="w-3xl flex flex-row justify-between">
                <div className="flex flex-col w-2xl">
                    <div className="h-16"></div>
                    <div className="flex justify-between">
                        <p className="text-5xl text-black font-normal">{username}</p>
                    </div>
                    <div className="h-6"></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="h-6"></div>
                    {
                        isUserOldContent?<div>
                                {userOldImage.length>28&&<img src={userOldImage}/>}
                                {userOldContent.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        <div className="text-xl leading-9 font-NanumSquareNeoOTF-rg">
                                            {line}
                                            <br />
                                        </div>
                                    </React.Fragment>))}
                                <div className="h-24"></div>
                            </div>:
                            <div className="h-56 bg-gray-50 flex flex-col items-center justify-center">
                                <p className="font-normal">소개 문구가 없습니다</p>
                            </div>
                    }
                </div>
                <div className="w-38 flex flex-col">
                    <div className="h-16"></div>
                    {userImage && !isUserImageDeleted?
                        <div className="relative rounded-full w-20 h-20 bg-emerald-700 flex ml-3 items-center justify-center ">
                            <img src={userImage} className="rounded-full w-full h-full object-cover"/>
                        </div>
                        :
                        <div className="relative rounded-full w-20 h-20 bg-emerald-700 flex ml-3 items-center justify-center ">
                            <p className="text-gray-100 flex items-center justify-center mb-3.5 text-10xl">{email[0]}</p>
                        </div>
                    }
                    <div className="h-4"></div>
                    <div>
                        <p className="ml-4">{username}</p>
                    </div>
                </div>
            </div>
            <div ref={bottomArea}></div>
        </div>
    )
}