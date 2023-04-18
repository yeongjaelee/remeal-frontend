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
    const refreshToken = localStorage.getItem('refreshToken')
    try {
        const {data} = await auth_client.mutate({mutation:UserService.CheckToken, variables:{'token':token, 'refreshToken': refreshToken}})
        console.log(data)
        if (data.checkToken.success){
            if (typeof data.checkToken.token ==='string' && typeof data.checkToken.refreshToken==='string'){
                localStorage.setItem('token', data.checkToken.token)
                localStorage.setItem('refreshToken', data.checkToken.refreshToken)
            }
            else if (typeof data.checkToken.token === 'string'){
                localStorage.setItem('token', data.checkToken.token)
            }
            else if (typeof data.checkToken.refreshToken === 'string'){
                localStorage.setItem('refreshToken', data.checkToken.refreshToken)
            }
        }
    } catch (err) {
        alert('재로그인 부탁드립니다')
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
