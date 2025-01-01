import React from "react";


export default function PageTitle({titleText}: {titleText: string}){
    return <h1 id="page-title">
        {titleText}
    </h1>
}