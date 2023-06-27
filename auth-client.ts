import {ApolloClient, InMemoryCache} from "@apollo/client";
import client from "./apollo-client";

const auth_client = new ApolloClient({
    uri: "https://test.api.re-meal.com/graphql",
    // uri: `${process.env.END_POINT}/graphql`,
    cache: new InMemoryCache(),
});


export default auth_client;
