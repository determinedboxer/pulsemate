import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  const user = await currentUser();

  return Response.json({
    message: "Clerk debug",
    userId: userId || null,
    isSignedIn: !!userId,
    fullUser: user ? {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
    } : null,
    env: {
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
      secretKeyStartsWith: process.env.CLERK_SECRET_KEY ?
        process.env.CLERK_SECRET_KEY.substring(0, 10) + "..." : "MISSING"
    }
  });
}
