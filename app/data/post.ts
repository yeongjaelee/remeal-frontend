import {gql} from "@apollo/client";

export default class PostService{
    static CreatePost = gql`
    mutation CreatePost($title:String, $content:String, $images:[Upload]){
        createPost(title:$title, content:$content, images:$images){
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
    static getPost = gql`
    query Post($id:Int){
        post(id:$id){
            title
            content
            dateCreated
            
        }
    }
    `;
    static getPostList = gql`
    query PostList{
        postList{
            id
            title
            content
            firstPostImage{
                id
                image
            }
        }
    }
    `;
}
