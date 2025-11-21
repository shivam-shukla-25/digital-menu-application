import React from 'react'
import DeleteCategoryPage from './DeleteCategoryPage'

export default async function DeletePage({ params }: { params: { id: string; categoryId: string }}) {
  const { id, categoryId } = await params;

  return (
    <>
      <DeleteCategoryPage params={{ id, categoryId }} />
    </>
  )
}