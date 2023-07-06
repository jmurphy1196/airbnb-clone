import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}, isMulti = false) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
  }
  if (
    options.body &&
    options.headers["Content-Type"] === "application/json" &&
    isMulti === false
  ) {
    options.body = JSON.stringify(options.body);
  }
  if (isMulti) {
    delete options.headers["Content-Type"];
  }

  const res = await fetch(url, options);
  if (res.status >= 400) throw res;
  return res;
}

export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}
