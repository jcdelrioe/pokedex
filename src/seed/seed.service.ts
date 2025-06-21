import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { PokeResponse } from './interfaces/poke.response.interface'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { AxiosAdapter } from 'src/common/adapters/axios.adapter'

@Injectable()
export class SeedService {
  private readonly fetch: typeof fetch

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({})

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    )
    // if (!response) {
    //   throw new Error('Failed to fetch Pokémon data')
    // }
    // const data = (await response.json()) as PokeResponse

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
