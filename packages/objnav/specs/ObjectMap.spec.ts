import 'mocha'

import expect from '.'

import { ObjectMap } from '../src/ObjectMap'

describe('when using ObjectMap', () => {
  const TEST_OBJECT: any = {
    logins: [
      {
        login: 'mpham',
        password: 'password',
      },
      {
        login: 'mike.pham',
        password: 'password',
      },
    ],
    user: {
      created: new Date(),
      firstname: 'mike',
      lastname: 'pham',
      address: {
        address1: '4617 Some Dream Boulevard',
        address2: 'Suite 101',
        city: 'Middleton',
        state: 'Florida',
        zip: {
          postal: 34243,
        },
      },
    },
    logout: () => {},
  }

  it('should map empty object', () => {
    expect(() => new ObjectMap({})).to.not.throw(Error)
  })

  it('should map object', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    expect(mapper).is.instanceof(ObjectMap)
  })

  it('should get list of nodes', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    expect(mapper.root.properties.map((objmap) => objmap.name)).is.deep.equal(['logins', 'user'])
  })

  it('should get leaf nodes', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    expect(mapper.nodes).to.not.be.empty
  })

  it('should get deep property', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    expect(mapper.get('user.address.zip.postal').value).to.deep.equal(34243)
  })

  it('should list property paths', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    const paths = mapper.paths()
    expect(paths.length).to.equal(18)
  })

  it('should select properties', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    const selected = mapper.select((objmap) => objmap.path.includes('address'))
    expect(selected).to.not.be.empty
  })

  it('should not map null', () => {
    expect(() => new ObjectMap(null)).throws(TypeError)
  })

  it('should not map undefined', () => {
    expect(() => new ObjectMap(undefined)).throws(TypeError)
  })
})
