import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/link-error';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {router} from "next/client";


const httpLink = new HttpLink({
    uri: "http://127.0.0.1:8000/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    try {
        if (token){
            jwt.verify(token,'my-token');
            console.log('Token is still valid');
        }
    } catch (err) {
        console.log('Error token');
        localStorage.removeItem('token');
        window.location.replace('/')
        console.log(11)
    }
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : '',
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        console.log(graphQLErrors);
    }
    if (networkError) {
        console.log('here is network error')
    }
});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});

export default client;
