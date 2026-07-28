import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { name, tshirtSize } = await request.json();

  if (!name?.trim() || !tshirtSize?.trim()) {
    return NextResponse.json(
      { error: "Name and t-shirt size are required" },
      { status: 400 }
    );
  }

  const group = await prisma.group.findUnique({ where: { slug } });
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  if (group.status === "ASSIGNED") {
    return NextResponse.json(
      { error: "Assignments already made, can't join now" },
      { status: 400 }
    );
  }

  const secretToken = uuidv4();
  const member = await prisma.member.create({
    data: {
      name: name.trim(),
      tshirtSize: tshirtSize.trim(),
      secretToken,
      groupId: group.id,
    },
  });

  return NextResponse.json({
    secretToken: member.secretToken,
    viewLink: `/me/${member.secretToken}`,
  });
}
