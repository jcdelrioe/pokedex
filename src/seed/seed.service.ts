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
    await this.pokemonModel.deleteMany({})

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=650')
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon data')
    }
    const data = (await response.json()) as PokeResponse

    const pokemonToInsert: { name: string; no: number }[] = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]

      pokemonToInsert.push({ name, no })

      // const pokemon = await this.pokemonModel.create({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed executed successfully'
  }
}
