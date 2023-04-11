"use client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import LoginModal from "./login/LoginModal";
import React, {useEffect, useState} from "react";
import Link from "next/link";
export default function NavLayout({
                                         children,
                                     }: {
    children: React.ReactNode,
}) {
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState<string>(null);
    useEffect(() => {
        const token = localStorage.getItem('token')
        setToken(token)
    }, []);
    return (
        <div>
            <div className="flex justify-between items-center pl-4 pt-4 pb-4 pr-4">
                <div className="flex flex-row items-center">
                    <div>
                        <Link href="/" className="homepageButton">
                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                        </Link>
                    </div>
                    <div>
                        <Link href="../chatting">
                            chatting room
                        </Link>
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