import React from "react";
import ReactDOM from "react-dom";
import "./tailwind.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import StateProvider from "./store/reducer/reducer";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://localhost:4000',
    cache: new InMemoryCache()
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <StateProvider>
            <App />
        </StateProvider>
    </ApolloProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
