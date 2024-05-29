const url = "http://localhost:4567";

export const fetchWithCredentials = (path: string, options: RequestInit = {}) =>
  fetch(`${url}/${path}`, {
    credentials: "include",
    ...options,
  });
