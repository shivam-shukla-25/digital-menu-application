import React from 'react'
import NewDishPage from './NewDishPage';

export default async function DishPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  return (
    <>
    <NewDishPage params={id} />
    </>
  )
}
