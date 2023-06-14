import React, {Fragment, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import TextModal from "./searchBar/TextModal";

// @ts-ignore
const ShareModal = ({ show, onClose, title, children }) => {
    const modalRef = useRef(null);
    const [isBrowser, setIsBrowser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [nextModalShow, setNextModalShow] = useState(false);
    useEffect(() => {
        setIsBrowser(true);
    }, []);
    // @ts-ignore
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();

    };
    // @ts-ignore
    function handleCopyClipBoard(url) {
        navigator.clipboard.writeText(url).then(() => {
            console.log('URL copied to clipboard!');
        }).catch((error) => {
            console.error('Failed to copy URL: ', error);
        });
        setNextModalShow(true);
    }
    // @ts-ignore
    const modalOutSideClick = (event) => {
        console.log(8)
        console.log(modalRef.current)
        // @ts-ignore
        if(modalRef.current && !modalRef.current.contains(event.target)) {
            onClose()
        }  }

    const modalContent = show ? (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" >
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity" onClick={()=>onClose()} ></div>
                <div className="flex items-center justify-center h-full w-full text-center " >
                    <div
                        className="relative top-72 inset-y-1 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-72 h-48 "
                    >
                        <div className="flex justify-end">
                            <button type="button"
                                    className="pr-6 pt-6 text-gray-400 justify-items-center"
                                    onClick={handleCloseClick}>X
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-bold">공유하기</p>
                            <div className="h-4"></div>
                            <div className="flex flex-row justify-between w-64 border border-gray-400 h-8 rounded-lg">
                                <div className="w-48 flex items-center">
                                    <p className="overflow-hidden truncate m-1.5 text-xs text-blue-500">{children}</p>
                                </div>
                                <button className="flex items-center justify-center w-16 text-xs bg-gray-200 rounded-r-lg"
                                        onClick={()=>handleCopyClipBoard(children)}>
                                    <p>URL복사</p>
                                </button>
                            </div>
                        </div>
                        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                    </div>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <TextModal
                        onClose={() => {setNextModalShow(false); onClose();}}
                        show={nextModalShow}
                    >
                    </TextModal>
            </div>
        </div>
    ) : null;

    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
        // @ts-ignore
            document.getElementById("modal")
        );
    } else {
        return null;
    }
};

export default ShareModal;