import { Router } from "next/router";
import { privateFetch } from "./fetch";

export function checkAuth(context) {
  try {
    return await privateFetch(context).get("/user");
  } catch (error) {
    if (context?.res) {
      context?.res?.writeHead?.(302, {
        Location: "/login"
      });
      context?.res?.end?.();
    } else {
      Router.replace("/login");
    }
  }
}

export function checkAdmin(context) {
  try {
    const { data } = await privateFetch(context).get("/user");

    if (data?.role !== "admin") {
      throw new Error("Insufficient Role");
    }
  } catch (error) {
    if (context?.res) {
      context?.res?.writeHead?.(302, {
        Location: "/login"
      });
      context?.res?.end?.();
    } else {
      Router.replace("/login");
    }
  }
}
