import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignMembers } from "@/lib/assignment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { adminToken } = await request.json();

  const group = await prisma.group.findUnique({
    where: { slug },
    include: { members: true },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  if (group.adminToken !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (group.status === "ASSIGNED") {
    return NextResponse.json({ error: "Already assigned" }, { status: 400 });
  }
  if (group.members.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 members" },
      { status: 400 }
    );
  }

  const assignments = assignMembers(
    group.members.map((m) => ({ id: m.id, name: m.name }))
  );

  const updates = [...assignments.entries()].map(([giverId, receiverId]) =>
    prisma.member.update({ where: { id: giverId }, data: { assignedToId: receiverId } })
  );

  await prisma.$transaction([
    ...updates,
    prisma.group.update({ where: { id: group.id }, data: { status: "ASSIGNED" } }),
  ]);

  return NextResponse.json({ success: true });
}
