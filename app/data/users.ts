import {gql} from "@apollo/client";

export default class UserService{
    static GetUsers = gql`
    query Users($emailContain : String){
        users(emailContain: $emailContain){
            id
            email
        }
    }`;
    static GetUser = gql`
    query User($token:String){
        user(token:$token){
            id
            email
            username
            userContent{
                content
                image
            }
            userImage{
                image
                isDeleted
            }
        }
    }
    `;
    static GetUserByEmail = gql`
    query GetUserByEmail($email:String){
        getUserByEmail(email:$email){
            id
            email
            username
            userContent{
                content
                image
            }
            userImage{
                image
                isDeleted
            }
        }
    }
    `;
    static verify = gql`
    mutation VerifyToken($token: String!) {
            verifyToken(token: $token) {
                    payload
                    }
                }`;
    static GetToken = gql`
    mutation GetToken($email:String!){
            getToken(email:$email){
                      success
                      token
				      refreshToken
				      email
                      }}`;
    static TokenAuth = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
                token
                payload
                refreshExpiresIn
                }}`;
    static refreshToken = gql`
    mutation RefreshToken($refreshToken: String!) {
             refreshToken(refreshToken: $refreshToken) {
                    token
                    payload
                    refreshToken
                    refreshExpiresIn
                     }
                    }`;
    static CheckRefreshToken = gql`
    mutation CheckRefreshToken($email: String!, $refreshToken: String!){
            checkRefreshToken(email: $email, refreshToken: $refreshToken){
                success
                refreshToken
                token
            }
    }
    `;
    static CheckToken = gql`
    mutation CheckToken($token: String!, $refreshToken: String!){
        checkToken(token:$token, refreshToken: $refreshToken){
            success
            token
            refreshToken
        }
    }
    `
}
