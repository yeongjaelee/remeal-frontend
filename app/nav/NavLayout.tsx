"use client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import LoginModal from "./login/LoginModal";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import Image from 'next/image';

export default function NavLayout() {
    const [showModal, setShowModal] = useState(false);
    // const token = localStorage.getItem('token')
    // const userEmailFirst = localStorage.getItem('userEmailFirst')
    const [token, setToken] = useState<string>('')
    const [userEmailFirst, setUserEmailFirst] = useState<string>('')

    const router = useRouter()
    useEffect(() => {
        console.log(1)
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const refreshToken = urlParams.get('refreshToken')
        const userEmailFirst = urlParams.get('userEmailFirst')
        if (typeof token === "string" && typeof refreshToken==="string" && typeof userEmailFirst==="string") {
            console.log(1)
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('userEmailFirst', userEmailFirst)
            window.location.replace('/')
        }
        console.log(localStorage.hasOwnProperty("token"))
        console.log(localStorage.hasOwnProperty('userEmailFirst'))
        if (localStorage.hasOwnProperty("token") && localStorage.hasOwnProperty('userEmailFirst')) {
            console.log('inside')
            // @ts-ignore
            setToken(localStorage.getItem('token'))
            // @ts-ignore
            setUserEmailFirst(localStorage.getItem('userEmailFirst'))
        }


    }, []);
    function goToWrite () {
        if(!token){
            alert('로그인해주세요')
            setShowModal(true)
        }
        else{
            router.push('../post/postCreate')
        }
    }
    return (
        <div className="h-12">
            <div className="flex justify-between items-center h-12 pl-4 pt-4 pb-4 pr-4">
                <div className="flex flex-row items-center">
                    <div>
                        <Link href="/" className="homepageButton">
                            <Image src={`https://www.re-meal.com/img/logo.png`} alt="" width="78" height="18"/>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row items-center h-12">
                    <button onClick={goToWrite}>
                        <div className="flex flex-row items-center justify-center">
                            <FontAwesomeIcon icon={faPenToSquare} style={{color: "#8c95a6",}} />
                            <p className="text-gray-400 ml-1 text-sm font-light">Write</p>
                        </div>
                    </button>
                    {token ?
                        <Link href="../profile" className="relative rounded-full w-6 bg-emerald-700 flex ml-3 items-center justify-center h-6">
                            <p className="text-gray-100 flex items-center justify-center mb-0.5">{userEmailFirst}</p>
                        </Link>
                        :
                        <button onClick={() => setShowModal(true)} className="loginButton ml-4">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" />
                        </button>
                        // eslint-disable-next-line react/jsx-no-comment-textnodes
                    }


                    <LoginModal
                        onClose={() => setShowModal(false)}
                        show={showModal}
                    >
                        Hello from the modal!
                    </LoginModal>
                </div>
            </div>
        </div>
    );
}