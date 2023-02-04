import { Show, createSignal, onMount } from "solid-js";
import axios from "axios";
import { SessionStatus, addTrackToLibrary } from "../utils";
import FutureSearch from "./future_search";

export default function MainPage() {
  const [youtubeSite, setYoutubeSite] = createSignal(false);
  const [loggedIn, setLoggedIn] = SessionStatus();
  let searchPhrase: HTMLInputElement;

  function handleAddToTracks() {
    browser.tabs.query({active: true}).then((tabs) => {
      const url = new URL(tabs[0].url); 
      const videoId = url.searchParams.get('v');
      return videoId
    }).then((vidId) => {
        if (vidId === null) { throw Error("videoId is null") }
        return axios.get("https://vid.puffyan.us/api/v1/videos/" + vidId)
      }).then((res) => {
        let addTrackParams:TrackParams = {
          artist: res.data.author,
          title: res.data.title,
          video_id: res.data.videoId,
          genre: res.data.genre,
          length: res.data.lengthSeconds,
          year: intToISOString(res.data.published),
        }
        console.log("final leg");
        return addTrackParams
      }).then((params) => {
        addTrackToLibrary(params)
      }).catch((error) => {console.warn(error)
      })
  }

  function intToISOString(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t.toISOString();
  }

  function handleDownloadAll() {
    console.log("clicked all");
  }

  function handleDownloadRemaining() {
    console.log("clicked remaining");
  }

  async function youtubePage() {
    browser.tabs.query({active: true}).then((tabs) => {
      if(tabs[0].url.split(".").includes("youtube")) {
        setYoutubeSite(true);
      }
    });
  }

  onMount(() => {
    youtubePage()
  })

  async function handleLogout() {
    browser.storage.local.set({auth: ""})
      .then(() => {setLoggedIn({loggedIn: false})})
      .catch(() => {setLoggedIn({loggedIn: false})});
  }

  async function handleAdd() {

  }

  return (
    <>
      <div class="grid grid-cols-2 bg-gray-50">
        <h1 class="text-xl font-semibold col-span-1">MP3XT</h1>
        <div class="col-span-1 flex justify-end">
          <button class="bg-primary-500 focus:ring-primary-200 hover:bg-primary-700 p-2 rounded text-white font-medium" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
      <div class="bg-gray-50 mx-auto p-10">
        <Show when={youtubeSite()} fallback={
          <div class="bg-gray-50 flex justify-center">
            <h1 class="text-l font-semibold">You need to be on Youtube to use this functionality</h1>
          </div>
        }>
          <div onClick={handleAddToTracks} class="mx-auto max-w-md rounded-lg bg-gray-200 shadow hover:cursor-pointer select-none py-10 border-black border-dashed hover:border-solid border hover:bg-green-400 hover:bg-opacity-30">
            <div class="p-4">
              <h3 class="text-xl font-medium text-gray-900" >Add Current Track</h3>
            </div>
          </div>
        </Show>
      </div>
      </>
  )
}

// <div class="mx-auto max-w-md">
//   <div class="flex h-40 max-w-md items-center justify-between">
//     <div onClick={handleDownloadRemaining} class="mx-5 max-w-md rounded-lg bg-gray-200 shadow hover:cursor-pointer select-none">
//       <div class="p-4">
//         <h3 class="text-xl font-medium text-gray-900" >Download Remaining</h3>
//       </div>
//     </div>
//     <div onClick={handleDownloadAll} class="mx-5 max-w-md rounded-lg bg-gray-200 shadow hover:cursor-pointer select-none">
//       <div class="p-4">
//         <h3 class="text-xl font-medium text-gray-900" >Download All Songs</h3>
//       </div>
//     </div>
//   </div>
// </div>
