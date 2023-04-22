import {gql} from "@apollo/client";

export default class PostService{
    static CreatePost = gql`
    mutation CreatePost($token:String, $title:String, $content:String, $images:[Upload], $tagsName:[String]){
        createPost(token:$token, title:$title, content:$content, images:$images, tagsName:$tagsName){
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
    query PostList($limit:Int){
        postList(limit:$limit){
            id
            title
            content
            dateCreated
            firstPostImage{
                id
                image
            }
            allNumber
            user{
                email
            }
            dateCreatedYear
            dateCreatedMonth
            dateCreatedDay
            tagsOnPost{
                id
                name
            }
        }
    }
    `;
    static allPost = gql`
    query AllPost{
        allPost
    }
    `;
}
