import React, {Fragment, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import TextModal from "./searchBar/TextModal";
import client from "../../apollo-client";
import ProfileService from "../data/profile";


// @ts-ignore
const EditProfileModal = ({ show, onClose, children, username, userEmailFirst, userImage }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const [isImage, setIsImage] = useState<boolean>(false);
    const imageRef = useRef(null)
    const [profileImage, setProfileImage]= useState<string>(userImage)
    const [isImageChange, setIsImageChange] = useState<boolean>(false)
    const [isImageDeleted, setIsImageDeleted] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    useEffect(() => {
        setIsBrowser(true);
        console.log(111)
        console.log(profileImage)
        if (userImage){
            setIsImageChange(true)
        }
    }, []);
    // @ts-ignore
    const handleCloseClick = (e) => {
        e.preventDefault();
        window.location.reload()
        onClose();
    };

    // @ts-ignore
    const imageClick = event => {
        // @ts-ignore
        imageRef.current.click();
    };
    // @ts-ignore
    const handleProfileImage = async event => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(i);
            setIsImageChange(true)
            reader.onload = () => {
                // @ts-ignore
                setProfileImage(reader.result);
            };
            // const formData = new FormData();
            // formData.append("image", i);
            const token = localStorage.getItem('token')
            await client.mutate({mutation: ProfileService.CreateUserImage, variables: {'token': token, 'image': i}})
            setIsImageDeleted(false)
        }
    };
    const cancleImage = async () => {
        const token = localStorage.getItem('token')
        await client.mutate({mutation: ProfileService.DeleteUserImage, variables: {'token': token}})
        setIsImageDeleted(true)
    }

    const saveHandler = async () => {
        const token = localStorage.getItem('token')
        const {data} = await client.mutate({mutation: ProfileService.UpdateUsername, variables: {'token':token, 'name':name}})
        if (data.userNameUpdate.success){
            window.location.reload()
            onClose();
        }
        else{
            alert('재시도해주세요')
        }
    }

    const modalContent = show ? (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-xl h-1.5xl"
                    >
                        <div className="flex justify-end">
                            <button type="button"
                                    className="pr-6 pt-6 text-gray-400 justify-items-center"
                                    onClick={handleCloseClick}>X
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="h-4"></div>
                            <div className="flex items-start w-xl">
                                <div className="w-10"></div>
                                <p className="font-NanumSquareNeoOTF-rg font-bold">Profile information</p>
                            </div>
                            <div className="h-10"></div>
                            <div className="w-xl flex items-start">
                                <div className="w-10"></div>
                                <p className="text-gray-400">photo</p>
                            </div>
                            <div className="h-2"></div>
                            <div className="w-xl flex items-start">
                                <div className="w-6"></div>
                                {userImage?
                                    <div className="relative rounded-full w-20 h-20 flex items-center justify-center">
                                        {isImageChange?(
                                            isImageDeleted
                                                ?
                                                <div className="relative rounded-full w-20 h-20 bg-emerald-700 flex items-center justify-center">
                                                    <p className="text-gray-100 flex items-center justify-center mb-2 text-5xl">{userEmailFirst}</p>
                                                </div>
                                                :
                                                <img src={profileImage} className="rounded-full w-full h-full object-cover"/>)

                                            :
                                            (isImageDeleted ?
                                                    <div className="relative rounded-full w-20 h-20 bg-emerald-700 flex items-center justify-center">
                                                        <p className="text-gray-100 flex items-center justify-center mb-2 text-5xl">{userEmailFirst}</p>
                                                    </div>
                                                    :
                                                    <img src={userImage} className="rounded-full w-full h-full object-cover"/>
                                            )
                                        }
                                    </div>:(isImageChange?(
                                        isImageDeleted
                                            ?
                                            <div className="relative rounded-full w-20 h-20 bg-emerald-700 flex items-center justify-center">
                                                <p className="text-gray-100 flex items-center justify-center mb-2 text-5xl">{userEmailFirst}</p>
                                            </div>
                                            :
                                            <div className="relative rounded-full w-20 h-20 flex items-center justify-center">
                                                <img src={profileImage} className="rounded-full w-full h-full object-cover"/>
                                            </div>
                                            )
                                            :
                                                <div className="relative rounded-full w-20 h-20 bg-emerald-700 flex items-center justify-center">
                                                    <p className="text-gray-100 flex items-center justify-center mb-2 text-5xl">{userEmailFirst}</p>
                                                </div>
                                            )
                                }
                                <div className="w-4"></div>
                                <div><input
                                    accept="image/*"
                                    multiple type="file"
                                    // style={{ display: "none" }}
                                    className="hidden"
                                    ref={imageRef}
                                    onChange={handleProfileImage}
                                />
                                    <button className="text-x text-green-700" onClick={imageClick}>update</button>
                                </div>
                                <div className="w-2"></div>

                                <div>
                                    <button className="text-x text-red-500" onClick={cancleImage}>remove</button>
                                </div>
                            </div>
                        </div>
                        <div className="h-10"></div>
                        <div className="flex">
                            <div className="w-10"></div>
                            <div>
                                <p className="text-gray-400">Name</p>
                            </div>
                        </div>
                        <div className="h-4"></div>
                        <div className="flex">
                            <div className="w-10"></div>
                            <input placeholder={username} className="placeholder-gray-600 outline-none w-96" value={name} onChange={(event)=>setName(event.target.value)}/>
                        </div>
                        <div className="flex">
                            <div className="w-10"></div>
                            <div className="border border-gray-200 w-96"></div>
                        </div>
                        <div className="h-4"></div>
                        <div className="flex justify-end">
                            <button className="rounded-full bg-white border border-green-700 mr-2 h-9 w-20" onClick={handleCloseClick}>
                                <p className="ml-4 mr-4 flex items-center mb-1.5 mt-1 text-black font-light tracking-wide w-12 flex justify-center text-center text-green-700">cancel</p>
                            </button>
                            <button className="rounded-full bg-green-700 border border-green-700 mr-2 h-9 w-20 " onClick={saveHandler}>
                                <p className="ml-4 mr-4 flex items-center mb-1.5 mt-1 text-black font-light tracking-wide w-12 flex justify-center text-center text-white">save</p>
                            </button>
                            <div className="w-12"></div>
                        </div>

                    </div>
                </div>
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

export default EditProfileModal;