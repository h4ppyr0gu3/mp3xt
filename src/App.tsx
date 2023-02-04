import type { Component } from 'solid-js';
import type { SetStoreFunction, Store } from 'solid-js/store';
import { onMount, Show } from 'solid-js';
import Login from "./components/login";
import MainPage from "./components/main_page";
import { SessionStatus, testSession } from "./utils";

declare global {
  interface Window {
    backendServer: string;
    invidiousApi: string;
  }
}

type Session = {
  loggedIn: boolean;
}

const App: Component = () => {
  window.backendServer = "http://localhost:3001";
  window.invidiousApi = "https://vid.puffyan.us";
  const [loggedIn, setLoggedIn]: [Store<Session>, SetStoreFunction<Session>] = SessionStatus()

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
      // console.log(storage.auth);
      if(storage.auth === "" || storage.auth === undefined) {
        setLoggedIn({loggedIn: false})
      } else {
        setLoggedIn({loggedIn: true})
      }
    })
  }
  
  return (
  <>
    <Show when={loggedIn.loggedIn}
      fallback={<Login/>}>
      <MainPage/>
    </Show>
    </>
  );
};

export default App;
