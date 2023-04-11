import React, {Fragment, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { gql } from "@apollo/client";


const RequestChattingModal = ({ show, onClose, title, children, id, email }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => {
        console.log(id)
        console.log(email)
        setIsBrowser(true);
    }, []);
    const modalContent = show ? (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            x
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-xl h-96">
                        <div className="flex justify-end m-3">
                            <button onClick={()=>onClose(false)}>
                                X
                            </button>
                        </div>
                        {email}
                        <div className="flex w-100 h-48">
                            <div className="flex justify-center items-end">
                                <div className="flex flex-row items-center justify-items-center overflow-hidden w-96">
                                    <button className="m-5">
                                        yes
                                    </button>
                                    <button className="m-5">
                                        no
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("chattingModal")
        );
    } else {
        return null;
    }
};

export default RequestChattingModal;