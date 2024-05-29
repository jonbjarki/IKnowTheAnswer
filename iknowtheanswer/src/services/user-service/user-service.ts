import { User } from "../../types";
import { fetchWithCredentials } from "../../utilities/fetch-utilities";

export async function authenticateUser(username: string, password: string) {
  const response = await fetchWithCredentials("login/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username,password})
  });

  if (response.ok) {
    return await response.json() as User;
  }
}

export async function registerUser(username: string, displayName: string, password: string) {
  const response = await fetchWithCredentials("register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({username,displayName,password})
});

  if (response.ok) {
    return await response.text();
  }
}


export async function getUser() {
  const response = await fetchWithCredentials("user/info");

  if (response.ok) {
    try {
      return await response.json() as User;
    } catch (error) {
      return undefined;
    }
  }
}

export async function logoutUser() {
  const response = await fetchWithCredentials("logout" , {
    method: "POST"
  });

  if (response.ok) {
    return await response.text();
  }
}