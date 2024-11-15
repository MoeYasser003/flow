"use server";

import { lucia, validateRequest } from "@/auth";

/**
 * Logout function: invalidates the session, clears the session cookie, and redirects to the login page.
 */
export async function logout() {
  // Validate the current request to get the session
  const { session } = await validateRequest();

  // If no session is found, throw an unauthorized error
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Invalidate the session in the authentication system
  await lucia.invalidateSession(session.id);

  // Create a blank session cookie using Lucia's utility
  const sessionCookie = lucia.createBlankSessionCookie();

  // Return a response with the `Set-Cookie` header and redirect
  return new Response(null, {
    headers: {
      "Set-Cookie": `${sessionCookie.name}=${sessionCookie.value}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      Location: "/login", // Redirect location
    },
    status: 302, // HTTP status for redirection
  });
}
