'use client'
import React, {useMemo, useRef, useState} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from 'html-react-parser';
import client from "../../../apollo-client";
import PostService from "../../data/post";
import ImageResize from '@looop/quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize)

// 위에서 설정한 모듈들 foramts을 설정한다
const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'image',
];

export default function PostCreate() {
    const [title, setTitle] = useState<string>("");
    const [value, setValue] = useState("");
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
                    ['image'],
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
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
        const token = localStorage.getItem('token')
        const {data} = await client.mutate({
            mutation: PostService.CreatePost,
            variables: {'token':token, 'title': title, 'content': value, 'images':images}
        })
        console.log(data)
        if (data.createPost.success) {
            alert('성공')
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

    return (
        <div className="flex flex-col justify-items-center items-center">
            <form onSubmit={handleChange}>
                <div>
                    <input type="text" placeholder="제목을 입력하세요" onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="w-3xl h-2xl border-2 border-gray-400">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        formats={formats}
                        className="h-2xl overflow-y-scroll "
                        onImageDelete={handleImageDelete}
                    />
                </div>
                <div className="m-4">
                    <button>submit</button>
                </div>

            </form>
        </div>
    );

}
