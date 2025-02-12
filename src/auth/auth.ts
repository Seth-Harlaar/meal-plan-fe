import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User, UserSearchCriteria } from "@/models/User";

export async function getSession() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user;
  } catch (error) {
    return null;
  }
}


export async function GetCurrentUser(){
  const userSub = await getSession();

  if(!userSub){
    return null;
  }

  let googleSub: string | undefined;

  if(typeof userSub === "string"){
    googleSub = userSub;
  } else if(typeof userSub === "object" && 'userSub' in userSub){
    googleSub = userSub.userSub;
  }

  if(!googleSub){
    return null;
  }

  let user = await User.GetUser(new UserSearchCriteria({GoogleId: googleSub}));
  return user;
}