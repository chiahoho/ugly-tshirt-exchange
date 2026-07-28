import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const adminToken = url.searchParams.get("adminToken");

  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      members: { select: { name: true, tshirtSize: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  if (group.adminToken !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({
    name: group.name,
    slug: group.slug,
    status: group.status,
    adminToken: group.adminToken,
    members: group.members,
  });
}
