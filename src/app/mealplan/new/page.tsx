import React from "react";

import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import PageTitle from "@/components/PageTitle";

export default async function Home() {
  const user = await GetCurrentUser();

  if(user){
    return (
      <>
        <PageTitle titleText="New Meal Plan"/>
      </>
    );
  } else {

    return (
      <LogInMessage/>
    );
  }
}

