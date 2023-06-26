import {ApolloClient, InMemoryCache} from "@apollo/client";
import client from "./apollo-client";

const auth_client = new ApolloClient({
    uri: "http://3.38.85.232:8000/graphql",
    // uri: `${process.env.END_POINT}/graphql`,
    cache: new InMemoryCache(),
});


export default auth_client;
