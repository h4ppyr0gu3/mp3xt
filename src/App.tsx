import type { Component } from 'solid-js';
import { onMount, Show } from 'solid-js';
import Login from "./components/login";
import MainPage from "./components/main_page";
import { SessionStatus, testSession } from "./utils";

import styles from './App.module.css';

declare global {
  interface Window {
    backendServer: string;
    invidiousApi: string;
  }
}

const App: Component = () => {
  window.backendServer = "http://localhost:3001";
  window.invidiousApi = "https://vid.puffyan.us";
  const [loggedIn, setLoggedIn] = SessionStatus()
  
  onMount(() => {
    // browser.storage.local.set({"auth": undefined})
    browser.storage.local.get(["auth"]).then((storage) => {
      console.log(storage.auth);
      console.log("auth");
    })
    testSession()
    setSessionState()
  })

  function setSessionState() {
    browser.storage.local.get(["auth"]).then((storage) => {
      console.log(storage.auth);
      if(storage.auth !== "") {setLoggedIn({loggedIn: true})}
      else {setLoggedIn({loggedIn: false})}
        // testSession(storage.auth);
      // console.log(storage.auth);

    })
  }
  
  return (
  <>
    <h1 class="text-gray-900 text-lg">Mp3xt</h1>
    <Show when={loggedIn.loggedIn}
      fallback={<Login/>}>
      <MainPage/>
    </Show>
    </>
  );
};

export default App;
