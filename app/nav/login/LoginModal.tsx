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
        await auth_client.mutate({mutation: CHECK_USER, variables:{'email':email}})
    }
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
        setFirstEmailPage(false)
        setIndex(0)
        setEmail('')
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
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity" onClick={handleCloseClick}></div>
                <div className="flex items-center justify-center h-full w-full text-center ">
                    <div
                        className="relative top-32 inset-y-1 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-2xl h-1.5xl"
                        >
                        <div className="flex justify-end h-12">
                            <button type="button"
                                    className="pr-6 pt-6 text-gray-400 justify-items-center"
                                    onClick={handleCloseClick}>X
                            </button>
                        </div>

                        <div className="flex w-2xl items-center">
                        <div className="flex justify-center items-end">
                            <div className="flex items-center justify-items-center overflow-hidden w-2xl">
                                <div className="flex transition duration-500 w-2xl" style={{transform:`translateX(-${index}00%)`}}>

                                    {/*<FirstEmailPage/>*/}
                                    <div className="flex flex-col w-2xl h-xl items-center justify-between">
                                        <div className="flex justify-center">
                                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                                        </div>
                                        <div className="flex flex-col items-center w-2xl">
                                            <div className="flex items-center justify-center w-full">
                                                <div className="flex items-center justify-center bg-yellow-300 w-44 h-8 rounded">
                                                    <button className="flex flex-row items-center">
                                                        <div>
                                                            <FontAwesomeIcon icon={faComment} />
                                                        </div>
                                                        <div className="w-32 font-normal content-center flex place-items-center items-center justify-center">
                                                            <div className="flex flex-col place-content-center">
                                                                <div className="h-1"></div>
                                                                <p className="text-xs font-NanumSquareNeoOTF-rg flex items-center justify-center">카카오로 시작하기</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="h-4"></div>
                                            <div className="flex items-center justify-center w-full">
                                                <div className="flex items-center justify-center bg-gray-200 w-44 h-8 rounded">
                                                    <button className="flex flex-row items-center" onClick={()=>setIndex(1)}>
                                                        <FontAwesomeIcon icon={faEnvelope} />

                                                        <div className="w-32 font-normal content-center flex place-items-center items-center justify-center">
                                                            <div className="flex flex-col place-content-center">
                                                                <div className="h-1"></div>
                                                                <p className="text-xs font-NanumSquareNeoOTF-rg flex items-center justify-center">이메일로 시작하기</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-xl flex justify-center">
                                            <div className="text-normal text-gray-700 text-xxs leading-3 ">
                                                <div>
                                                    <p>{'"시작하기"'} 버튼을 누르면 개인정보 처리 방침과 서비스 이용약관에 동의하시는 것으로 간주됩니다.이를 확인하시</p>
                                                </div>
                                                <div className="flex flex-row justify-center">
                                                    <p>려면,&nbsp;</p><p className="underline underline-offset-2">개인정보 처리 방침</p>과 <p className="underline underline-offset-2">서비스 이용약관</p><p>을 읽으신 후, 동의하신다면 {'"시작하기"'} 버튼을 클릭해주세요</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*<SecondEmailPage/>*/}
                                    <div className="flex flex-col w-2xl h-xl items-center justify-between">
                                        <div className="flex justify-center">
                                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                                        </div>
                                            <div className="flex items-center justify-center w-2xl">
                                                <div className="flex flex-col items-center justify-center w-56">
                                                    <p className="font-normal text-xs font-NanumSquareNeoOTF-rg">
                                                        이메일을 입력해주세요
                                                    </p>
                                                    <div className="h-8"></div>
                                                    <form onSubmit={handleEmail}>
                                                        <input className="text-center w-56 outline-none font-NanumSquareNeoOTF-rg font-normal text-xs text-gray-500" placeholder="example@gmail.com"
                                                               onChange={(e)=>setEmail(e.target.value)}/>
                                                    </form>
                                                    <div className="w-44 border-t border-gray-700"></div>
                                                    {error && <div className="text-xxs" style={{color: 'red'}}>{error}</div>}
                                                </div>
                                            </div>
                                            <div className="h-6">
                                                <button className="text-green-700 font-NanumSquareNeoOTF-rg font-normal text-xs" onClick={()=>setIndex(0)}>
                                                    {'<'} 다른 방법으로 시작하기
                                                </button>
                                            </div>
                                    </div>

                                    {/*<ThirdEmailPage/>*/}
                                    <div className="flex flex-col w-2xl h-xl items-center justify-between">
                                        <div className="flex justify-center">
                                            <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                                        </div>
                                        <div className="flex items-center justify-center w-2xl">
                                            <div className="flex flex-col items-center justify-center w-56">
                                                <p className="font-normal text-base font-NanumSquareNeoOTF-rg">
                                                    인증 메일이 전송되었습니다.
                                                </p>
                                                <div className="h-8"></div>
                                                    <div className="flex flex-col justify-center items-center w-2xl text-xs font-normal">
                                                        <div className="flex flex-row">
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
                                        <div className="h-6">
                                            <button className="text-green-700 font-NanumSquareNeoOTF-rg font-normal text-xs" onClick={handleCloseClick}>
                                                확인
                                            </button>
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