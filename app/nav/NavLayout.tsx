"use client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import LoginModal from "./login/LoginModal";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
export default function NavLayout({
                                         children,
                                     }: {
    children: React.ReactNode,
}) {
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token')
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const refreshToken = urlParams.get('refreshToken')
        if (typeof token === "string" && typeof refreshToken==="string") {
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            window.location.replace('/')
        }
    }, []);
    return (
        <div>
            <div className="flex justify-between items-center pl-4 pt-4 pb-4 pr-4 border-b-2 border-gray-300">
                <div className="flex flex-row items-center">
                    <div>
                        <Link href="/" className="homepageButton">
                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                        </Link>
                        <div>
                            <Link href="../chatting">
                                chatting room
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {token ?
                        <div>
                            you are log in
                        </div>
                        : ''}
                    <button onClick={() => setShowModal(true)} className="loginButton ml-4">
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" />
                    </button>
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