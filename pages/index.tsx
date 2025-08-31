import React from 'react'

export default function HomePage({ text }) {
  return <p>{text}</p>
}

export async function getServerSideProps() {
  //const response = await fetch(`http://${process.env.API}`)
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/ditto`)

  const body = await response.text()

  return {  props: { text: body } }
}
