import React from 'react'
import NewCategoryPage from './NewCategoryPage';

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  return (
    <>
    <NewCategoryPage params={id} />
    </>
  )
}
