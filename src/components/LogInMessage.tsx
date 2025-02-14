import { GetCurrentUser } from "@/auth/auth"




export default async function LogInMessage(){

  const User = await GetCurrentUser();

  if(!User){
    return (
      <> Please login </>
    )
  } else {
    return (
      <> There was an issue while authenticating you. Please logout and try again. </>
    )
  }
}