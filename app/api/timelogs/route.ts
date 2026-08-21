import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
      const logs = await prisma.timeLog.findMany({
        orderBy: {
          workDate: "desc",
        },
      });
  
      return NextResponse.json(logs);
    } catch (error) {
      console.error("GET TIMELOGS ERROR:", error);
  
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { workDate, timeIn, timeOut, remarks } = body;

    if (!workDate || !timeIn || !timeOut) {
      return NextResponse.json(
        { error: "Date, Time In, and Time Out are required" },
        { status: 400 }
      );
    }

    // Convert times into minutes
    const [inHours, inMinutes] = timeIn.split(":").map(Number);
    const [outHours, outMinutes] = timeOut.split(":").map(Number);

    const timeInTotal = inHours * 60 + inMinutes;
    const timeOutTotal = outHours * 60 + outMinutes;

    let totalMinutes = timeOutTotal - timeInTotal;

    // Handle overnight work
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    const log = await prisma.timeLog.create({
      data: {
        workDate: new Date(workDate),
        timeIn,
        timeOut,
        totalMinutes,
        remarks: remarks || null,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create time log" },
      { status: 500 }
    );
  }
}