import React, {Fragment, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import UserService from "../../data/users";
import auth_client from "../../../auth-client";

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
        const {data} = await auth_client.mutate({mutation: UserService.GetToken, variables:{'email':email}})
        if (data.getToken.success){
            localStorage.setItem('token', data.getToken.token)
            localStorage.setItem('refreshToken', data.getToken.refreshToken)
            localStorage.setItem('email', data.getToken.email)
            window.location.replace('/');
        }
        else{
            alert('로그인을 다시하세요');
            window.location.replace('/');
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
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-2xl h-2/3"
                        >
                        <div className="flex justify-end">
                            <button type="button"
                                    className="pr-6 pt-6 text-gray-400 justify-items-center"
                                    onClick={handleCloseClick}>X
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                        </div>
                        <div className="flex w-2xl h-2xl items-center">
                        <div className="flex justify-center items-end">
                            <div className="flex items-center justify-items-center overflow-hidden w-2xl h-2xl">
                                <div className="flex transition duration-500 w-2xl" style={{transform:`translateX(-${index}00%)`}}>

                                    {/*<FirstEmailPage/>*/}
                                    <div className="flex flex-col w-2xl h-xl items-center">
                                        <div className="flex flex-col items-center justify-items-center justify-center h-xxl" >
                                            <div className="flex items-center justify-center w-2xl h-8">
                                                <div className="flex items-center justify-center bg-yellow-300 w-56">
                                                    <FontAwesomeIcon icon={faComment} />
                                                    <div className="text-center w-32">
                                                        카카오로 시작하기
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center w-2xl h-8">
                                                <div className="flex items-center justify-center bg-gray-200 w-56">
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                    <button className="text-center w-32" onClick={()=>setIndex(1)}>
                                                        이메일로 시작하기
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-8">
                                            개인정보관련
                                        </div>

                                    </div>



                                    {/*<SecondEmailPage/>*/}
                                    <div className="flex flex-col items-center justify-items-center w-2xl h-xl">
                                        <div className="flex items-center justify-center w-2xl h-xxl">
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
                                        <div className="h-8">
                                            <button className="text-green-700" onClick={()=>setIndex(0)}>
                                                {'<'} 다른 방법으로 시작하기
                                            </button>

                                        </div>
                                    </div>

                                    {/*<ThirdEmailPage/>*/}
                                    <div className="flex flex-col items-center justify-items-center w-2xl h-xl">
                                        <div className="flex flex-col items-center justify-center w-2xl h-xxl">
                                            <div className="flex flex-col items-center justify-center w-2xl h-36">
                                                <p className="text-xl">
                                                    인증메일이 전송되었습니다
                                                </p>
                                            </div>
                                            <div className="flex flex-col justify-center items-center w-2xl h-24">
                                                <div className="flex flex-row h-6">
                                                    <p className="text-base mr-1 text-green-700 font-light">
                                                        {email}{" "}
                                                    </p>
                                                    <p className="text-base">
                                                        으로 인증링크가 담긴 메일을 보냈어요.
                                                    </p>
                                                </div>
                                                <div className="flex flex-row h-6">
                                                    <p className="text-base">
                                                        인증을 완료하시려면 메일의 링크를 클릭해주세요.
                                                    </p>
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