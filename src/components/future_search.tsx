import { createStore } from "solid-js/store";
import { For, onMount, createSignal } from "solid-js";

export default function FutureSearch() {
  let searchPhrase: HTMLInputElement;

  function handleAdd() {
    // let updatedStore = searches
    // console.log("searches");
    // console.log(searches.target);
    // updatedStore.push(searchPhrase.value)
    // console.log(updatedStore);
    // setSearches(updatedStore)
    browser.storage.local.get(["searches"]).then((storage) => {
      var test = storage.searches
      test.push(searchPhrase.value)
      browser.storage.local.set({searches: searches})
    })
  }

  function initializeSearchStore() {
    browser.storage.local.get(["searches"]).then((storage) => {
      console.log("async");
      console.log(typeof(storage))
      if (storage.searches === undefined) {
        browser.storage.local.set({searches: []})
        return []
      } else {
        console.log(storage.searches);
        return storage.searches;
      }
    })
  }

  onMount(() => {
    initializeSearchStore();
  })

  return (
    <>
      <div class="mx-5 max-w-md py-10">
        <label class="mb-1 block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500">Search</label>
        <div class="flex flex-row mx-auto max-w-md">
          <div class=" flex-basis-3/4 px-3">
            <input type="email" ref={searchPhrase} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="Future Search Term" />
          </div>
          <button class="bg-blue-400 p-2 rounded flex-basis-1/4" onClick={handleAdd}>Search/Add</button>
        </div>
        <p class="mt-1 text-sm text-gray-500">Offline search which will be synced when you visit the web app and open the application</p>
      </div>
      <For each={initializeSearchStore()}>{(item) =>
        <li>
          {item}
        </li>
      }</For>
      </>
  )
}
