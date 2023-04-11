import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Page from "../chatting/page";
const LeftSideBar = () => {

    return (
        <div className="fixed top-10 left-0 bottom-0 w-32 bg-amber-300 flex-col">
            <div className="flex justify-center items-center">
                <Link href='../chatting/./page'>
                    chatting room
                </Link>
            </div>
            <div className="flex justify-center items-center">
                <button>
                    nothing
                </button>
            </div>
        </div>
    );
};

export default LeftSideBar;