// Tells Convex to trust JWTs issued by Clerk. `CLERK_JWT_ISSUER_DOMAIN` is
// set as a Convex deployment environment variable (Convex dashboard ->
// Settings -> Environment Variables), NOT in the React app.
//
// In Clerk, create a JWT template named "convex" (Clerk dashboard -> JWT
// Templates) - the applicationID below must match that template's name.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
