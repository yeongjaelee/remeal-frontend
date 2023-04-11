'use client';
import SearchBarPage from "../components/searchBar/page";
import client from "../../apollo-client";
import UserService from "../data/users";
import React, {useState} from "react";
import LoginModal from "../nav/login/LoginModal";
import RequestChattingModal from "./requestChattingModal";

export default function ChattingHomePage() {
    const [showModal, setShowModal] = useState(false);
    const [results, setResults] = useState<object>([]);
    const [sendId, setSendId] = useState<number>(0)
    const [sendEmail, setSendEmail] = useState<string>('')
    const handleSearch = async (query) => {
        console.log(query)
        const {data} = await client.query({
            query: UserService.GetUsers, variables:{
                emailContain : query
            }
        })
        setResults(data.users)

    };

    function requestChatting (id:number, email:string) {
        setSendId(id)
        setSendEmail(email)
        setShowModal(true)
    }

    return (
        <div id="modal">
            <div id="chattingModal">
                here is chatting room page
                <SearchBarPage onSearch={handleSearch}/>
                <ul>
                    {results.map((result) => (
                        <li key={result.id}>
                            <button onClick={()=>requestChatting(result.id, result.email)}>
                                {result.email}
                            </button>
                        </li>
                    ))}
                </ul>
                <RequestChattingModal
                    onClose={() => setShowModal(false)}
                    show={showModal}
                    id = {sendId}
                    email = {sendEmail}
                >
                    Hello from the modal!
                </RequestChattingModal>
            </div>
        </div>
    );
}
