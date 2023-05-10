import {gql} from "@apollo/client";

export default class ProfileService{
    static CreateUserContent = gql`
    mutation UserContentMutation($token:String, $content:String, $image:Upload, $isImageSrc:Boolean){
        userContentMutation(token:$token, content:$content, image:$image, isImageSrc:$isImageSrc){
            success
        }
        }
    `;

}