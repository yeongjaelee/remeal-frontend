import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/link-error';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {router} from "next/client";
import UserService from "./app/data/users";
import auth_client from "./auth-client";


const httpLink = new HttpLink({
    uri: "http://127.0.0.1:8000/graphql",
});

const authLink = setContext( async (_, {headers}) => {
    const token = localStorage.getItem('token');
    try {
        const decodedToken = jwt.decode(token) as JwtPayload;
        if (decodedToken && decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
            // If the token is expired, remove it from local storage and redirect to login page
            const refresh = localStorage.getItem('refreshToken')
            const email = localStorage.getItem('email')
            const {data} = await auth_client.mutate({
                mutation: UserService.CheckRefreshToken,
                variables: {'refreshToken': refresh, 'email':email}
            })
            console.log(data)
            if (data.checkRefreshToken.success){
                console.log('success')
                localStorage.setItem('token', data.checkRefreshToken.token)
                localStorage.setItem('refreshToken', data.checkRefreshToken.refreshToken)
                window.location.replace('/');
            }
            else{
                console.log('fail')
                alert('로그인을 apollo-client 다시하세요')
                window.location.replace('/');
            }
        } else {
            await auth_client.mutate({mutation: UserService.verify, variables: {'token': token}})
        }
    } catch (err) {
        try {
            const refresh = localStorage.getItem('refreshToken')
            const email = localStorage.getItem('email')
            const {data} = await auth_client.mutate({
                mutation: UserService.CheckRefreshToken,
                variables: {'refreshToken': refresh, 'email':email}
            })
            console.log(data)
            if (data.refreshToken.success){
                console.log('success')
                localStorage.setItem('token', data.checkRefreshToken.token)
                localStorage.setItem('refreshToken', data.checkRefreshToken.refreshToken)
                window.location.replace('/');
            }
            else{
                console.log('fail')
                alert('로그인을 apollo-client 다시하세요')
                window.location.replace('/');
            }
        } catch (err) {
            alert('로그인을 다시 해주세요')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('token');
            window.location.replace('/')
        }
    }
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
        console.log('here is network error')
    }
    if (graphQLErrors) {
        console.log(graphQLErrors);
    }

});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});

export default client;
