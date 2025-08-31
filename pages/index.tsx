import React from 'react'

export default function HomePage({ text }) {
  return <p>{text}</p>
}

export async function getServerSideProps() {
  const response = await fetch(`http://${process.env.API}`)

  const body = await response.text()

  return {  props: { text: body } }
}
