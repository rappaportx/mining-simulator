import { getServerSession } from "next-auth/next";
import prisma from '../../../lib/prisma';  // Using relative path

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
      });
    }

    const data = await req.json();
    const { firstName, lastName, phone } = data;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { firstName, lastName, phone },
    });

    return new Response(JSON.stringify(updatedUser));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
