import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "./redux/store";
import App from './App'

ReactDom.render(<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
    </PersistGate>
</Provider>, document.querySelector('#root'))