import { User, UserSearchCriteria } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
const {google} = require('googleapis');
import * as jose from 'jose'

export async function GET(request: NextRequest) {
  return Response.redirect(`${process.env.BASE_URL}/`);
}
