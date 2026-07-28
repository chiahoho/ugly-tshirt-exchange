import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const { name } = await request.json();

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Group name is required" }, { status: 400 });
  }

  const slug = uuidv4().slice(0, 8);
  const adminToken = uuidv4();

  const group = await prisma.group.create({
    data: { name: name.trim(), slug, adminToken },
  });

  return NextResponse.json({
    slug: group.slug,
    adminToken: group.adminToken,
    inviteLink: `/group/${group.slug}`,
    adminLink: `/group/${group.slug}/admin/${group.adminToken}`,
  });
}
