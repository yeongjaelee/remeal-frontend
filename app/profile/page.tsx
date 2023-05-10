'use client'

import {useEffect, useLayoutEffect, useRef, useState} from "react";
import React from 'react';

import UserService from "../data/users";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faImage} from "@fortawesome/free-solid-svg-icons";
import ProfileService from "../data/profile";
import {ThemeProvider} from "@material-tailwind/react";
import value = ThemeProvider.propTypes.value;
import client from "../../apollo-client";

export default function Page() {
    const [username, setUsername] = useState<string>('')
    const [isUserContent, setIsUserContent] = useState<boolean>(false)
    const [userOldContent, setUserOldContent] = useState<string>('')
    const [userOldImage, setUserOldImage] = useState<string>('')
    const [isUserOldContent, setIsUserOldContent] = useState<boolean>(false)
    const [userContent, setUserContent] = useState<string>('')
    const [imageSrc, setImageSrc] = useState<string>('')
    const [image, setImage] = useState(null)
    const [line, setLine] = useState<number>(0)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const contentTextarea = useRef(null);
    const bottomArea = useRef(null);
    const imageInput = useRef(null);

    async function userData() {
        const token = localStorage.getItem('token')
        const {data} = await client.query({query: UserService.GetUser, variables:{'token':token}})
        if(data.user.userContent.content || data.user.userContent.image){
            setIsUserOldContent(true)
            setUserContent(data.user.userContent.content)
            if (data.user.userContent.image){
                setImageSrc("http://127.0.0.1:8000/media/" +data.user.userContent.image)
            }
            else{
                setImageSrc(null)
            }
            setIsEdit(true)
        }
        else{
            setIsUserOldContent(false)
        }
        setUsername(data.user.username)
        setUserOldContent(data.user.userContent.content)
        setLine(data.user.userContent.content.split("\n").length)
        setUserOldImage(data.user.userContent.image)
        const imageUrl = "http://127.0.0.1:8000/media/" + data.user.userContent.image
        setUserOldImage(imageUrl)

    }
    function goToEditProfile() {
        setIsUserContent(true)
        setTimeout(() => {
            contentTextarea.current.focus();
        }, 0);
    }
    function handleTextareaChange() {
        contentTextarea.current.style.height = 'auto';
        contentTextarea.current.style.height = `${contentTextarea.current.scrollHeight}px`;
    }
    const handleUpload = event => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            setImage(i)
            // const body = new FormData();
            // body.append("image", i);
            const reader = new FileReader();
            reader.readAsDataURL(i);
            return new Promise((resolve) => {
                reader.onload = () => {
                    setImageSrc(reader.result);
                    resolve();
                };
            });
        }
    };
    const handleClick = event => {
        imageInput.current.click();
    };
    async function saveUserContent () {
        console.log(userContent)
        console.log(image)
        let isImageSrc = false
        if (imageSrc.length>0){
            console.log(1111)
            isImageSrc = true
        }
        const formData = new FormData();
        formData.append("image", image);
        const token = localStorage.getItem('token')
        const {data} = await client.mutate({mutation: ProfileService.CreateUserContent,
                                                        variables:{'token':token,
                                                            'content':userContent,
                                                            'image':image,
                                                            'isImageSrc':isImageSrc}})
        if(data.userContentMutation.success){
            window.location.reload()
        }
        else{
            alert('재시도해주세요')
        }
    }
    function handleCancel () {
        if (isEdit){
            setIsUserContent(false)
        }
        else{
            setIsUserContent(false);
            setUserContent('');
            setImageSrc('')
        }

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
                        <div className="flex items-center">
                            <p className="text-xl">...</p>
                        </div>
                    </div>
                    <div className="h-6"></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="h-6"></div>
                    <div>
                        {isUserContent?
                            <div className="flex flex-col">
                                <textarea id="textarea" ref={contentTextarea} value={userContent} rows={line} onChange={(e)=>{setUserContent(e.target.value); handleTextareaChange();}}
                                          className="border border-none outline-0 h-auto overflow-y-visible text-xl leading-9 font-NanumSquareNeoOTF-rg" />
                                <div className="h-4"></div>
                                <div className="flex justify-between">
                                    <input
                                        accept="image/*"
                                        multiple type="file"
                                        // style={{ display: "none" }}
                                        className="hidden"
                                        ref={imageInput}
                                        onChange={handleUpload}
                                    />
                                    {!imageSrc && <button onClick={handleClick}>
                                        <FontAwesomeIcon icon={faImage} style={{color: "#0a0c10",}} size="xl"  />
                                    </button>}
                                    {imageSrc &&
                                        <div className="flex flex-row">
                                            <img src={imageSrc} alt="preview-img" width="200" height="200"/>
                                            <button className="ml-1"
                                                    onClick={()=>{setImageSrc('');
                                                                  setImage(null)}}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </button>
                                        </div>

                                    }
                                    <div className="flex flex-row">
                                        <button className="rounded-full bg-white border border-black mr-2 h-9"
                                                onClick={handleCancel}>
                                            <p className="ml-4 mr-4 flex items-center mb-1.5 mt-1 text-black font-light tracking-wide w-12">cancel</p>
                                        </button>
                                        <button className="rounded-full bg-black h-9 border border-black" onClick={saveUserContent}>
                                            <p className="ml-4 mr-4 flex items-center mb-1.5 mt-1 text-white font-extralight tracking-wide w-12 flex justify-center">Save</p>
                                        </button>
                                    </div>
                                </div>
                                <div className="h-8"></div>
                                <div className="border-b border-gray-200"></div>
                                <div className="h-36"></div>
                            </div>
                            :
                            (isUserOldContent?<div>
                                {userOldImage.length>28&&<img src={userOldImage}/>}
                                    {userOldContent.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            <div className="text-xl leading-9 font-NanumSquareNeoOTF-rg">
                                                {line}
                                                <br />
                                            </div>
                                        </React.Fragment>))}
                                <div className="flex justify-end">
                                    <button className="rounded-full bg-white border border-black mr-2 h-9 flex items-center justify-center"
                                            onClick={goToEditProfile}>
                                        <p className="ml-4 mr-4 flex items-center mb-1.5 mt-1 text-black font-light tracking-wide w-12 flex items-center justify-center">edit</p>
                                    </button>
                                </div>
                                <div className="h-24"></div>
                                </div>:
                                <div className="h-56 bg-gray-50 flex flex-col items-center justify-center">
                                    <p className="font-normal">자신을 소개해 주세요 !</p>
                                    <div className="h-6"></div>
                                    <div className="rounded-lg border border-black flex items-center">
                                        <button className="m-1 ml-2 mr-2" onClick={goToEditProfile}>get started</button>
                                    </div>
                                </div>)
                        }
                    </div>
                </div>
                <div className="w-38">
                    edit profile
                </div>
            </div>
            <div ref={bottomArea}></div>
        </div>
    )
}