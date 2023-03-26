"use client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import LoginModal from "./login/LoginModal";
import { useState } from "react";
import Link from "next/link";
export default function NavLayout({
                                         children,
                                     }: {
    children: React.ReactNode,
}) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <div className="flex justify-between pl-4 pt-4 pb-4 pr-4">
                <div>
                    <Link href="/" className="homepageButton">
                        {/*<img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt=""/>*/}
                        <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                    </Link>
                </div>
                <div className="justify-items-end">
                    <button onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" />
                    </button>
                </div>
                <LoginModal
                    onClose={() => setShowModal(false)}
                    show={showModal}
                >
                    Hello from the modal!
                </LoginModal>

            </div>
            {children}

        </div>
    );
}