import expect from './expect'

import { Merge } from '../src/Utilities/Merge'
import { DeepPartial } from '../src/Utilities/DeepPartial'

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
    const merged = Merge<Person>(DefaultPerson)
    expect(merged.aliases).to.deep.equal(DefaultPerson.aliases)
  })
})
