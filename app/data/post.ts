import {gql} from "@apollo/client";

export default class PostService{
    static CreatePost = gql`
    mutation CreatePost($title:String, $content:String, $mainImage:Upload, $images:[Upload]){
        createPost(title:$title, content:$content, mainImage:$mainImage, images:$images){
            success
        }
    }
    `;
    static UploadImage = gql`
    mutation UploadImage($image:Upload){
        uploadImage(image:$image){
            url
        }
    }
    `;
}
