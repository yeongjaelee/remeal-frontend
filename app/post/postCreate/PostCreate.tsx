'use client'
import dynamic, {Loader} from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';
import './style.scss';
import {useState, useEffect, useRef, useMemo} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import client from "../../../apollo-client";
import PostService from "../../data/post";
import { ForwardedRef } from 'react';
import { Quill } from 'react-quill';
// @ts-ignore
// import ImageResize from '@looop/quill-image-resize-module-react';

// type QuillType = typeof ReactQuill & {
//     Quill: any; // Add the Quill type declaration if necessary
// };
const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import('react-quill');
    // @ts-ignore
    return function comp({ forwardedRef, ...props }) {
        return <RQ ref={forwardedRef} {...props} />;
    };
}, { ssr: false });

// const Font = Quill.import("formats/font");
// @ts-ignore
// const Size = Quill.import("attributors/style/size");
// Font.whitelist = ["dotum", "gullim", "batang", "NanumGothic"];
// Size.whitelist = [
//     "18px",
//     "20px",
//     "22px",
//     "24px",
//     "26px",
//     "28px",
// ];
// Quill.register(Size, true);
// // Quill.register(Font, true);
// Quill.register('modules/imageResize', ImageResize)

export default function PostCreate(params:any) {
    const searchParams = useSearchParams();
    const router = useRouter()
    const [title, setTitle] = useState<string>("");
    const [tags, setTags] = useState([])
    const [value, setValue] = useState<string>("");
    const postId = searchParams.get('id')

    const quillRef = useRef<any>(null);
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.addEventListener("change", async () => {
            const file = input.files?.[0];
            const reader = new FileReader();
            // @ts-ignore
            reader.readAsDataURL(file); // Read the selected image file as data URL
            reader.onload = async () => {
                const imageDataUrl = reader.result as string;
                try {
                    const { data } = await client.mutate({
                        mutation: PostService.UploadImage,
                        variables: { image: imageDataUrl },
                    });
                    const IMG_URL = data.uploadImage.url;
                    const imageUrl = "https://dev.re-meal.com/" + IMG_URL
                    const quill = quillRef.current?.getEditor();
                    console.log(quill)
                    if (quill) {
                        const range = quill.getSelection();
                        if (range) {
                            quill.insertEmbed(range.index, "image", imageUrl);
                            quillRef.current.getEditor().setSelection(range.index + 1);

                        }
                    }
                    // const range = quillRef.current.getEditorSelection();
                    // quillRef.current.getEditor().insertEmbed(range.index, 'image', imageUrl)
                    // quillRef.current.getEditor().setSelection(range.index + 1);
                    // document.body.querySelector(':scope > input').remove()
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
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                // [{size:[
                //         "18px",
                //         "20px",
                //         "22px",
                //         "24px",
                //         "26px",
                //         "28px",]}],
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                    { align: [] },
                ],
                ['image'],
                [{ 'color':
                        ['#000000',
                            '#e60000',
                            '#ff9900',
                            '#ffff00',
                            '#008a00',
                            '#0066cc',
                            '#9933ff',
                            '#ffffff',
                            '#facccc',
                            '#ffebcc',
                            '#ffffcc',
                            '#cce8cc',
                            '#cce0f5',
                            '#ebd6ff',
                            '#bbbbbb',
                            '#f06666',
                            '#ffc266',
                            '#ffff66',
                            '#66b966',
                            '#66a3e0',
                            '#c285ff',
                            '#888888',
                            '#a10000',
                            '#b26b00',
                            '#b2b200',
                            '#006100',
                            '#0047b2',
                            '#6b24b2',
                            '#444444',
                            '#5c0000',
                            '#663d00',
                            '#666600',
                            '#003700',
                            '#002966',
                            '#3d1466',]},]
            ],
            handlers: {
                // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
                image: imageHandler,
            },
        },
        // imageResize: { modules: ['Resize'] },
    };
    }, []);
    // @ts-ignore
    function removeTag(index){
        setTags(tags.filter((el, i) => i !== index))
    }
    // @ts-ignore
    function extractImageUrls(htmlString) {
        const regex = /<img.*?src="(.*?)"/g;
        const urls = [];
        let match;
        while ((match = regex.exec(htmlString))) {
            urls.push(match[1]);
        }
        return urls;
    }
    // @ts-ignore
    function handleKeyDown(e){
        // If user did not press enter key, return
        if(e.key !== 'Enter') return
        // Get the value of the input
        const value = e.target.value
        // If the value is empty, return
        if(!value.trim()) return
        // Add the value to the tags array
        // @ts-ignore
        setTags([...tags, value])
        // Clear the input
        e.target.value = ''
    }
    const handleNavigate = () => {
        router.replace('/');
        // window.location.reload();
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };
    // @ts-ignore
    async function handleChange(e) {
        e.preventDefault();
        const images = extractImageUrls(value)
        console.log(images)

        const token = localStorage.getItem('token')
        if(images.length===0){
            alert('최소 하나의 이미지를 첨부해주세요.')
        }
        else{
            if(postId){
                console.log(value)
                const {data} = await client.mutate({
                    mutation: PostService.UpdatePost,
                    variables: {'postId':Number(postId), 'title': title, 'content': value, 'images':images, 'tagsName':tags}
                })
                console.log(data)
                if (data.updatePost.success) {
                    handleNavigate()
                }
            }
            else{
                const {data} = await client.mutate({
                    mutation: PostService.CreatePost,
                    variables: {'token':token, 'title': title, 'content': value, 'images':images, 'tagsName':tags}
                })
                console.log(data)
                if (data.createPost.success) {
                    handleNavigate()
                }
            }
        }
    }
    async function getPost() {
        const {data} = await client.query({query: PostService.getPost, variables: {'id': Number(postId)}})
        setTitle(data.post.title)
        setValue(data.post.content)
        // @ts-ignore
        setTags(prevTags => [...prevTags, ...data.post.tagsOnPost.map(item => item.name)]);
    }
    useEffect(()=>{
        if (typeof document !== "undefined") {
            console.log('nonono')
            // Code that uses the document object
            if(postId){
                getPost()
            }
            // useref로 커서 위치조정 해주는건데 잘 안됨
            // setTimeout(()=>{
            //     console.log('yesyes')
            //     console.log(quillRef.current)
            //     if (quillRef.current instanceof ReactQuill) {
            //         console.log('helllooo')
            //         quillRef.current.focus()
            //     }
            //     quillRef.current && quillRef.current.focus();
            // },50)

        }
        else{
            alert('undefined')
        }

    },[])
    return (
        <div className="flex flex-col justify-items-center items-center">
            <div className="h-3"></div>
            <div>
                <div className="h-12 w-3xl bg-transparent border-2 border-transparent border-none border-r-0 border-t-0 border-b-0 border-l-0">
                    <input type="text" placeholder="제목을 입력하세요" className="bg-transparent h-12 w-3xl border-2 border-transparent outline-0" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="h-2"></div>
                <div className="h-2xl overflow-y-scroll">
                    <ReactQuill
                        // @ts-ignore
                        forwardedRef={quillRef}
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        // formats={formats}
                        className="w-3xl"
                        // onImageDelete={handleImageDelete}
                    />
                </div>
                <div className="h-6"></div>
                <div className="flex flex-wrap w-3xl">
                    {tags.map((tag, index) => (
                        <div className="mr-1 h-7 rounded-2xl bg-gray-200 opacity-75 flex items-center justify-center flex flex-row mt-2" key={index}>
                            <p className="text font-NanumSquareNeoOTF-rg font-normal text-xs leading-5 ml-3 h-4 ">#{tag}</p>
                            <button className="close flex items-center ml-1 mr-3 h-4" onClick={() => removeTag(index)}>&times;</button>
                        </div>
                    )) }
                    <input onKeyPress={handleKeyDown} type="text" className="bg-transparent outline-0" placeholder="#해시태그를 입력하세요" />
                </div>
                <div className="flex justify-end">
                    <button className="rounded-full bg-green-700 border border-green-700 mr-2 h-9 w-20 justify-end " onClick={handleChange}>
                        <p className="ml-4 mr-4 flex items-center mb-1.5 mt-1 text-black font-light tracking-wide w-12 flex justify-center text-center text-white">save</p>
                    </button>
                    <div className="w-4"></div>
                </div>
            </div>
        </div>
    )
}
