import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const member = await prisma.member.findUnique({
    where: { secretToken: token },
    include: {
      group: true,
      assignedTo: { select: { name: true, tshirtSize: true } },
    },
  });

  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: member.name,
    tshirtSize: member.tshirtSize,
    groupName: member.group.name,
    groupStatus: member.group.status,
    assignedTo: member.assignedTo
      ? { name: member.assignedTo.name, tshirtSize: member.assignedTo.tshirtSize }
      : null,
  });
}
