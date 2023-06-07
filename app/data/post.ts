import {gql} from "@apollo/client";

export default class PostService{
    static CreatePost = gql`
    mutation CreatePost($token:String, $title:String, $content:String, $images:[Upload], $tagsName:[String]){
        createPost(token:$token, title:$title, content:$content, images:$images, tagsName:$tagsName){
            success
        }
    }
    `;
    static UpdatePost = gql`
    mutation UpdatePost($postId:Int, $title:String, $content:String, $images:[Upload], $tagsName:[String]){
        updatePost(postId:$postId, title:$title, content:$content, images:$images, tagsName:$tagsName){
            success
        }
    }
    `
    static UploadImage = gql`
    mutation UploadImage($image:Upload){
        uploadImage(image:$image){
            url
        }
    }
    `;
    static getPostUser = gql`
    query Post($id:Int, $token:String){
        post(id:$id){
            title
            content
            dateCreated
            comments{
                comment
            }
            user{
              email
            }
            dateCreatedYear
            dateCreatedMonth
            dateCreatedDay
            dateCreatedHour
            dateCreatedMinute
            tagsOnPost{
                id
                name
            }
            likeNumber
            isLikeUser(token: $token){
                isLike
            }
            isMine(token: $token)
        }
    }
    `;
    static getPost = gql`
    query Post($id:Int){
        post(id:$id){
            title
            content
            dateCreated
            comments{
                comment
            }
            user{
              email
            }
            dateCreatedYear
            dateCreatedMonth
            dateCreatedDay
            dateCreatedHour
            dateCreatedMinute
            tagsOnPost{
                id
                name
            }
            likeNumber
        }
    }
    `;
    static getPostList = gql`
    query PostList($limit:Int, $offset:Int, $tagName:String, $email:String){
        postList(limit:$limit, offset:$offset, tagName:$tagName, email:$email){
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

    static createComment = gql`
    mutation CreateComment($postId: Int, $token:String, $comment:String){
        createComment(postId:$postId, token:$token, comment:$comment){
            success
            isWriter
            comments{
                comment
                dateCreated
                user{
                  email
                }
                userImage{
                    image
                    isDeleted
                }
            
            }
        }
    }
    `;

    static getComments = gql`
    query Comments($postId: Int){
        comments(postId: $postId){
            comment
            user{
              email
            }
            dateCreated
            userImage{
                image
                isDeleted
            }
        }
    }
    `;
    static likeOnPost = gql`
    mutation LikeOnPost($token: String, $postId: Int, $isLike: Boolean){
        likeOnPostMutation(token: $token, postId: $postId, isLike: $isLike){
            success
            likeNumber
            isLikeResult
        }
    }
    `;
}
