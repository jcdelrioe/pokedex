import { Injectable } from '@nestjs/common'
import { PokeResponse } from './interfaces/poke.response.interface'

@Injectable()
export class SeedService {
  private readonly fetch: typeof fetch
  async executeSeed() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon data')
    }
    const data = (await response.json()) as PokeResponse

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]

      console.log({ name, no })
    })

    return data.results
  }
}
