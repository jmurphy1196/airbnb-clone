import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
  }
  if (options.body && options.headers["Content-Type"] === "application/json") {
    options.body = JSON.stringify(options.body);
  }
  const res = await window.fetch(url, options);
  if (res.status >= 400) throw res;
  return res;
}

export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}
