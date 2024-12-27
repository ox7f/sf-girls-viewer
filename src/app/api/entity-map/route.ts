"use server";

import { NextResponse } from "next/server";
import type { EntityMap } from "@/types/FileTypes";
import { loadAllEntities } from "@/utils/FileUtils";

let cachedEntityMap: EntityMap | null = null;

export async function GET() {
  try {
    cachedEntityMap = cachedEntityMap ?? (await loadAllEntities());
    return NextResponse.json({ data: cachedEntityMap });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
