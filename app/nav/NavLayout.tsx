"use client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import LoginModal from "./login/LoginModal";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
export default function NavLayout({
                                         children,
                                     }: {
    children: React.ReactNode,
}) {
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token')
    const userEmailFirst = localStorage.getItem('userEmailFirst')
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const refreshToken = urlParams.get('refreshToken')
        const userEmailFirst = urlParams.get('userEmailFirst')
        if (typeof token === "string" && typeof refreshToken==="string" && typeof userEmailFirst==="string") {
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('userEmailFirst', userEmailFirst)
            window.location.replace('/')
        }
    }, []);
    return (
        <div className="h-12">
            <div className="flex justify-between items-center h-12 pl-4 pt-4 pb-4 pr-4">
                <div className="flex flex-row items-center">
                    <div>
                        <Link href="/" className="homepageButton">
                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row items-center h-12">
                    <Link href="../post/postCreate">
                        <div className="flex flex-row items-center justify-center">
                            <FontAwesomeIcon icon={faPenToSquare} style={{color: "#8c95a6",}} />
                            <p className="text-gray-400 ml-1 text-sm font-light">Write</p>
                        </div>
                    </Link>
                    {token ?
                        <Link href="../profile" className="relative rounded-full w-6 bg-green-500 flex ml-3 items-center justify-center h-6">
                            <p className="text-gray-100 flex items-center justify-center mb-0.5">{userEmailFirst}</p>
                        </Link>
                        :
                        <button onClick={() => setShowModal(true)} className="loginButton ml-4">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" />
                        </button>
                    }
                    <LoginModal
                        onClose={() => setShowModal(false)}
                        show={showModal}
                    >
                        Hello from the modal!
                    </LoginModal>
                </div>

            </div>
            {children}
        </div>
    );
}