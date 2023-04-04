import React, {Fragment, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { gql } from "@apollo/client";
import client from "../../../apollo-client";

const CHECK_USER = gql`
    mutation CheckUser($email:String){
        checkUser(email:$email){
            success
            token
        }
    }
`;

const LoginModal = ({ show, onClose, title, children }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const [firstEmailPage, setFirstEmailPage] = useState(false);
    const [index, setIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>(null);

    const check_user = async () => {
        const {data} = await client.mutate({mutation: CHECK_USER, variables: {'email':email}})
        console.log('success')
        if (data.checkUser.token !== undefined){
            localStorage.setItem('token', data.checkUser.token)
        }
        else {
            alert('check the email')
        }
    }

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
        setFirstEmailPage(false)
    };

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleEmail = (event) => {
        event.preventDefault()
        console.log(email)
        if (!isValidEmail(email)) {
            setError('이메일 형식을 바르게 입력하세요');
        } else {
            setError(null);
            setIndex(2)
        }
        check_user().then(r => console.log(r))

    };
    const modalContent = show ? (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-xl h-96">
                        <div className="flex justify-end">
                            <button type="button"
                                    className="pr-6 pt-6 text-gray-400 justify-items-center"
                                    onClick={handleCloseClick}>X
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                        </div>
                        <div className="flex w-100 h-48">
                        <div className="flex justify-center items-end">
                            <div className="flex items-center justify-items-center overflow-hidden w-96">
                                <div className="flex transition duration-500 w-96" style={{transform:`translateX(-${index}00%)`}}>

                                    {/*<FirstEmailPage/>*/}
                                    <div className="flex flex-col items-center justify-items-center w-96">
                                        <div className="flex items-center justify-center w-96 h-8">
                                            <div className="flex items-center justify-center bg-yellow-300 w-56">
                                                <FontAwesomeIcon icon={faComment} />
                                                <div className="text-center w-32">
                                                    카카오로 시작하기
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-96 h-8">
                                            <div className="flex items-center justify-center bg-gray-200 w-56">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                <button className="text-center w-32" onClick={()=>setIndex(1)}>
                                                    이메일로 시작하기
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                    {/*<SecondEmailPage/>*/}
                                    <div className="flex flex-col items-center justify-items-center w-96">
                                        <div className="flex items-center justify-center w-96 h-24">
                                            <div className="flex flex-col items-center justify-center w-56">
                                                <div>
                                                    이메일을 일력해주세요
                                                </div>
                                                <div className="h-8"></div>
                                                <form onSubmit={handleEmail}>
                                                    <input className="text-center w-56 outline-none" placeholder="example@gmail.com"
                                                           onChange={(e)=>setEmail(e.target.value)}/>
                                                </form>
                                                {error && <h2 style={{color: 'red'}}>{error}</h2>}
                                                <div className="w-56 border-t-4"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*<ThirdEmailPage/>*/}
                                    <div className="flex flex-col items-center justify-items-center w-96">
                                        <div className="flex items-center justify-center w-96 h-24">
                                            <div className="flex flex-col items-center justify-center w-56">
                                                이메일을 보냈습니다
                                            </div>
                                        </div>
                                    </div>

                                </div>
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
            document.getElementById("modal")
        );
    } else {
        return null;
    }
};

export default LoginModal;