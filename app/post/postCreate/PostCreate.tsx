'use client'
import React, {useCallback, useMemo, useRef, useState} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from 'html-react-parser';
import client from "../../../apollo-client";
import PostService from "../../data/post";
import ImageResize from '@looop/quill-image-resize-module-react';
import './style.scss';
import {useRouter} from "next/navigation";


// 위에서 설정한 모듈들 foramts을 설정한다
const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'image',
    'font',
    'size',
    'list',
    'indent',
    'align'
];
const Font = Quill.import("formats/font");
const Size = Quill.import("attributors/style/size");
Font.whitelist = ["dotum", "gullim", "batang", "NanumGothic"];
Size.whitelist = [
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "22px",
    "24px",
    "26px",
    "28px",
];
Quill.register(Size, true);
// Quill.register(Font, true);
Quill.register('modules/imageResize', ImageResize)


export default function PostCreate() {
    const router = useRouter()
    const [title, setTitle] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [tags, setTags] = useState([])
    const quillRef = useRef<ReactQuill>();
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.addEventListener("change", async () => {
            const file = input.files?.[0];
            const reader = new FileReader();
            reader.readAsDataURL(file); // Read the selected image file as data URL
            reader.onload = async () => {
                const imageDataUrl = reader.result as string;
                try {
                    const { data } = await client.mutate({
                        mutation: PostService.UploadImage,
                        variables: { image: imageDataUrl },
                    });
                    const IMG_URL = data.uploadImage.url;
                    const imageUrl = "http://127.0.0.1:8000" + IMG_URL
                    if (quillRef.current instanceof ReactQuill) {
                        const editor = quillRef.current.getEditor();
                        const range = editor.getSelection();
                        if ("index" in range) {
                            editor.insertEmbed(range.index, "image", imageUrl);
                        }
                    }
                } catch (error) {
                    console.log("Failed to upload image:", error);
                }
            };
        });
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{header: [1, 2, 3, 4, 5, 6, false]}],
                    [{font:['serif','monospace',"dotum", "gullim", "batang", "NanumGothic"]}],
                    [{size:["9px",
                            "10px",
                            "11px",
                            "12px",
                            "14px",
                            "16px",
                            "18px",
                            "20px",
                            "22px",
                            "24px",
                            "26px",
                            "28px",]}],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                        { align: [] },
                    ],
                    ['image'],
                ],
                handlers: {
                    // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
                    image: imageHandler,
                },
            },
            imageResize: { modules: ['Resize'] },
    };
    }, []);
    function extractImageUrls(htmlString) {
        const regex = /<img.*?src="(.*?)"/g;
        const urls = [];
        let match;
        while ((match = regex.exec(htmlString))) {
            urls.push(match[1]);
        }
        return urls;
    }
    async function handleChange(e) {
        e.preventDefault();
        const images = extractImageUrls(value)
        console.log(images)
        const token = localStorage.getItem('token')
        if(images.length===0){
            alert('최소 하나의 이미지를 첨부해주세요.')
        }
        else{
            const {data} = await client.mutate({
                mutation: PostService.CreatePost,
                variables: {'token':token, 'title': title, 'content': value, 'images':images, 'tagsName':tags}
            })
            console.log(data)
            if (data.createPost.success) {
                alert('성공')
                router.push('/')
            }
        }

    }
    const handleImageDelete = (image) => {
        console.log('delete image')
        if (quillRef.current instanceof ReactQuill) {
            const editor = quillRef.current.getEditor();
            const selection = editor.getSelection();
            if ("index" in selection) {
                editor.formatText(selection.index, selection.length, 'clean', {image: image});
                const content = quillRef.current.getEditor().root.innerHTML;
                setValue(content);
            }
        }
    };
    function handleKeyDown(e){
        // If user did not press enter key, return
        if(e.key !== 'Enter') return
        // Get the value of the input
        const value = e.target.value
        // If the value is empty, return
        if(!value.trim()) return
        // Add the value to the tags array
        setTags([...tags, value])
        // Clear the input
        e.target.value = ''
    }
    function removeTag(index){
        setTags(tags.filter((el, i) => i !== index))
    }

    return (
        <div className="flex flex-col justify-items-center items-center">
            <div className="h-3"></div>
            <div>
                <div className="h-12 w-3xl bg-transparent border-2 border-transparent border-none border-r-0 border-t-0 border-b-0 border-l-0">
                    <input type="text" placeholder="제목을 입력하세요" className="bg-transparent h-12 w-3xl border-2 border-transparent outline-0" onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="h-2"></div>

                <div className="h-2xl overflow-y-scroll ">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        formats={formats}
                        className="h-2xl w-3xl overflow-y-scroll"
                        onImageDelete={handleImageDelete}
                    />

                    <div className="w-3xl border border-gray-300"></div>
                </div>
                <div className="h-6 border-t-2"></div>
                <div className="flex flex-wrap w-3xl">
                    { tags.map((tag, index) => (
                        <div className="mr-1 h-7 rounded-2xl bg-gray-200 opacity-75 flex items-center justify-center flex flex-row mt-2" key={index}>
                            <p className="text font-NanumSquareNeoOTF-rg font-normal text-xs leading-5 ml-3 h-4 ">#{tag}</p>
                            <button className="close flex items-center ml-1 mr-3 h-4" onClick={() => removeTag(index)}>&times;</button>
                        </div>
                    )) }

                    <input onKeyPress={handleKeyDown} type="text" className="bg-transparent outline-0" placeholder="#해시태그를 입력하세요" />
                </div>
                <div className="mt-3">
                    <button onClick={handleChange}>submit</button>
                </div>
            </div>

        </div>
    );

}
