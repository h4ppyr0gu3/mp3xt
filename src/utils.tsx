import { createStore } from "solid-js/store";
import axios from "axios";

const [loggedIn, setLoggedIn] = createStore({loggedIn: true});

export const SessionStatus = () => [loggedIn, setLoggedIn];

type Tab = {
  url: string;
}

export function testSession() {
  const url:string = window.backendServer + "/api/v1/whoami";
  return axios.get(url).then((res) => {
    setAuth(res.headers.authorization);
    if (res.data.success === false)
    setAuth("");
    console.log(res.data.user.email);
  }).catch((error) => { console.log(error) });
}

export function setAuth(token:string) {
  browser.storage.local.set({auth: token})
    .then(() => {setLoggedIn({loggedIn: true})})
    .catch(() => {setLoggedIn({loggedIn: false})});
}

export function addTrackToLibrary(params: TrackParams) {
  const url:string = window.backendServer + "/api/v1/tracks";
  browser.storage.local.get(["auth"]).then((storage) => {
    return axios
      .post(url, params, {
        headers: {Authorization: storage.auth},
      }).then((res) => {
        setAuth(res.headers.authorization);
      }).catch((error) => { console.log(error) });
  })
}

export async function youtube(): Promise<string | undefined | null> {
  var videoId: string | null | undefined;
  browser.tabs.query({active: true}).then((tabs: [Tab]) => {
    const url = new URL(tabs[0].url); 
    videoId = url.searchParams.get('v');
  })
  return videoId
}
