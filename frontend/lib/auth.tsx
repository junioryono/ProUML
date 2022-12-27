import { User } from "types";
import { cookies } from "next/headers";
import { decode, JwtPayload } from "jsonwebtoken";

export function getSession(): User {
  const idToken = cookies().get("id_token");
  if (!idToken) {
    return null;
  }

  // Parse the ID token
  try {
    const token = decode(idToken.value) as JwtPayload;

    // Verify the ID token
    if (token.aud != "https://api.prouml.com") {
      return null;
    }

    if (token.iss != "https://api.prouml.com") {
      return null;
    }

    // Make sure the token is not expired
    const now = new Date().getTime() / 1000;
    if (token.exp < now) {
      return null;
    }

    if (!token || !token["user_metadata"]) {
      return null;
    }

    return token["user_metadata"] as User;
  } catch (err) {
    console.log(err);
    return null;
  }
}
