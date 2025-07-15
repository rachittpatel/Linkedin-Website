import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { Component } from "react";


export default function App({ Component, pageProps }) {
  return <>
   <Provider store={store}>

    <Component {...pageProps} />
   </Provider>
  </>
}
