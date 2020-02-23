// https://stackoverflow.com/questions/1626263/enum-flags-in-javascript

import 'mocha'

import expect from './expect'

import { FlagEnums } from '../src/Utilities/FlagEnums'

enum Test {
  None = 0,
  First = 1,
  Second = 2,
  Third = 4,
  Four = 8,
}

describe('FlagEnums', () => {
  let service: FlagEnums

  beforeEach(() => (service = new FlagEnums()))

  it('should create with initial value', () => {
    service = new FlagEnums(Test.First)
    expect(service.get()).to.equal(Test.First)
  })

  it('should return true if has flag', () => {
    service = new FlagEnums(Test.First)
    expect(service.has(Test.First)).to.be.true
  })

  it("should return false if doesn't have flag", () => {
    service = new FlagEnums(Test.First)
    expect(service.has(Test.Second)).to.be.false
  })

  it('should add', () => {
    expect(
      service
        .add(Test.First)
        .add(Test.Second)
        .get(),
    ).to.equal(Test.First + Test.Second)
  })

  it('should not add the same value twice', () => {
    expect(
      service
        .add(Test.First)
        .add(Test.First)
        .get(),
    ).to.equal(Test.First)
  })

  it('should remove', () => {
    expect(
      service
        .add(Test.First)
        .add(Test.Second)
        .delete(Test.Second)
        .get(),
    ).to.equal(Test.First)
  })

  it('should return 0 when add then remove the same value', () => {
    expect(
      service
        .add(Test.First)
        .delete(Test.First)
        .get(),
    ).to.equal(0)
  })

  it('should not remove not added values', () => {
    expect(
      service
        .add(Test.First)
        .delete(Test.Second)
        .get(),
    ).to.equal(Test.First)
  })
})
