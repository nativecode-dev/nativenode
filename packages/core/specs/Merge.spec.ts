import { DeepPartial } from 'ts-essentials'

import { expect } from './helpers'
import { Merge } from '../src/utils/Merge'

interface Person {
  firstname: string
  lastname: string
  aliases: string[]
}

const DefaultPerson: DeepPartial<Person> = {
  firstname: 'Dummy',
  lastname: 'Person',
  aliases: ['dummy'],
}

describe('when using Merge', () => {
  it('should de-dupe array properties', () => {
    const merged = Merge<Person>([DefaultPerson])
    expect(merged.aliases).to.deep.equal(DefaultPerson.aliases)
  })
})
