import React, {Fragment, useEffect, useState} from "react";
import ReactDOM from "react-dom";


const TextModal = ({ show, onClose, title, children }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };
    const modalContent = show ? (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-72 h-36"
                    >
                        <div className="flex flex-col items-center justify-center h-28">
                            <div>주소가 복사되었습니다.</div>
                            <div>원하는 곳에 붙여넣기 해주세요.</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={handleCloseClick}>닫기</button>
                        </div>
                    </div>
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

export default TextModal;