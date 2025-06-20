import { Injectable } from '@nestjs/common'
import { PokeResponse } from './interfaces/poke.response.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { Model } from 'mongoose'

@Injectable()
export class SeedService {
  private readonly fetch: typeof fetch

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon data')
    }
    const data = (await response.json()) as PokeResponse

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]

      const pokemon = await this.pokemonModel.create({ name, no })
    })

    return 'Seed executed successfully'
  }
}
