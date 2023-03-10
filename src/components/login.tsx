import axios from "axios";
import { SessionStatus } from "../utils.tsx";
import { onMount } from "solid-js";

export default function Login() {
  let email:HTMLInputElement, password:HTMLInputElement;
  const [loggedIn, setLoggedIn] = SessionStatus();

  function handleSubmit(e) {
    e.preventDefault();
    authenticate(email.value, password.value);
  }

  async function authenticate(email, password) {
    let url:string, data:object;
    url = window.backendServer + "/api/auth/sign_in"
    updateStoredEmail(email)
    data = {email: email, password: password}

    return axios.post(url, data)
      .then((response) => {setAuth(response.headers.authorization)})
      .catch((error) => {console.log(error)});
  };

  function setAuth(token:string) {
    browser.storage.local.set({auth: token})
      .then(() => { setLoggedIn({loggedIn: true}) })
      .catch(() => { setLoggedIn({loggedIn: false}) });
  }

  function fillEmailField() {
    browser.storage.local.get(["email"]).then((storage) => {
      if ( storage.email !== undefined ) { email.value = storage.email }
    })
  }

  function updateStoredEmail(email: string) {
    browser.storage.local.set({email: email})
  }

  onMount(() => {
    fillEmailField()
  })

  return(
    <>
      <div class="flex justify-center pb-3">
        <h1 class="text-xl font-semibold"> Login </h1>
      </div>
      <div class="mx-auto max-w-xl">
        <form action="" class="space-y-5">
          <div class="grid grid-cols-3 items-center">
            <label for="example4" class="col-span-1 block text-sm font-medium text-gray-700">Email</label>
            <div class="col-span-2">
              <input type="email" ref={email} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="email address" />
            </div>
          </div>
          <div class="grid grid-cols-3 items-center">
            <label for="example5" class="col-span-1 block text-sm font-medium text-gray-700">Password</label>
            <div class="col-span-2">
              <input type="password" ref={password} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="Password" />
            </div>
          </div>
          <div class="grid grid-cols-3 items-center">
            <div class="col-span-2 col-start-2">
              <input type="submit" class="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300" onClick={handleSubmit} value="Log In"/>
            </div>
          </div>
        </form>
      </div>
      </>
  )

}
