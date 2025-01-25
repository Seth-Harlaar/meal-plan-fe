import React from "react";


export default function PageTitle({titleText}: {titleText: string}){
  return <div id="page-title">
    <h1>{titleText}</h1>
  </div>
}