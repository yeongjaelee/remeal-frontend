import {gql} from "@apollo/client";

export default class ProfileService{
    static CreateUserContent = gql`
    mutation UserContentMutation($token:String, $content:String, $image:Upload, $isImageSrc:Boolean){
        userContentMutation(token:$token, content:$content, image:$image, isImageSrc:$isImageSrc){
            success
        }
        }
    `;
    static CreateUserImage = gql`
    mutation UserImageMutation($token:String, $image:Upload){
        userImageMutation(token:$token, image:$image){
            success
        }
    }
    `;
    static DeleteUserImage = gql`
    mutation DeleteUserImage($token:String){
        deleteUserImage(token:$token){
            success
        }
    }
    `;
    static UpdateUsername = gql`
    mutation UserNameUpdate($token:String, $name:String){
        userNameUpdate(token:$token, name:$name){
            success
        }
    }
    `;

}