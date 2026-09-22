import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      workDate,
      timeIn,
      timeOut,
      remarks,
    } = body;

    if (!workDate || !timeIn || !timeOut) {
      return NextResponse.json(
        {
          error: "Date, time in, and time out are required.",
        },
        { status: 400 }
      );
    }

    const [inHours, inMinutes] = timeIn
      .split(":")
      .map(Number);

    const [outHours, outMinutes] = timeOut
      .split(":")
      .map(Number);

    let totalMinutes =
      outHours * 60 +
      outMinutes -
      (inHours * 60 + inMinutes);

    // Supports overnight shifts.
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    const updatedLog = await prisma.timeLog.update({
      where: {
        id: Number(id),
      },
      data: {
        workDate: new Date(`${workDate}T00:00:00`),
        timeIn,
        timeOut,
        totalMinutes,
        remarks: remarks || null,
      },
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("UPDATE TIMELOG ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update time log.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.timeLog.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE TIMELOG ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete time log.",
      },
      { status: 500 }
    );
  }
}