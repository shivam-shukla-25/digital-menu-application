import React from 'react'
import CustomerMenuPage from "./CustomerMenuPage";


export default async function MenuPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  return (
    <>
    <CustomerMenuPage params={id} />
    </>
  )
}
