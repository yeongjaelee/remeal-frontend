import React, {Fragment, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import TextModal from "./searchBar/TextModal";


const ShareModal = ({ show, onClose, title, children }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [nextModalShow, setNextModalShow] = useState(false);
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };
    function handleCopyClipBoard(url) {
        navigator.clipboard.writeText(url).then(() => {
            console.log('URL copied to clipboard!');
        }).catch((error) => {
            console.error('Failed to copy URL: ', error);
        });
        setNextModalShow(true);
    }

    const modalContent = show ? (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-72 h-48"
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
                    </div>
                    <TextModal
                        onClose={() => {setNextModalShow(false); onClose();}}
                        show={nextModalShow}
                    >
                    </TextModal>
                </div>
            </div>
        </div>
    ) : null;

    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal")
        );
    } else {
        return null;
    }
};

export default ShareModal;