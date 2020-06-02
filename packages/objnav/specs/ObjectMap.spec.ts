import 'mocha'

import expect from '.'

import { ObjectMap } from '../src/ObjectMap'

describe('when using ObjectMap', () => {
  const TEST_OBJECT: any = {
    logins: [
      {
        login: 'mpham',
        password: 'passwordsexlove',
      },
      {
        login: 'mike.pham',
        password: 'passwordsexlove',
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
  }

  const TEST_OBJECT_FUNCTION: any = { ...TEST_OBJECT, logout: () => {} }

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

  it('should exclude arrays', () => {
    const mapper = new ObjectMap(TEST_OBJECT, { include: { arrays: false } })
    expect(mapper.root.properties.map((objmap) => objmap.name)).is.deep.equal(['user'])
  })

  it('should exclude dates', () => {
    const mapper = new ObjectMap(TEST_OBJECT, { include: { dates: false } })
    expect(mapper.get('user').properties.map((objmap) => objmap.name)).is.deep.equal([
      'firstname',
      'lastname',
      'address',
    ])
  })

  it('should include functions', () => {
    const mapper = new ObjectMap(TEST_OBJECT_FUNCTION, { include: { functions: true } })
    expect(mapper.root.properties.map((objmap) => objmap.name)).is.deep.equal(['logins', 'user', 'logout'])
  })

  it('should exclude numbers', () => {
    const mapper = new ObjectMap(TEST_OBJECT, { include: { numbers: false } })
    expect(mapper.get('user').properties.map((objmap) => objmap.name)).is.deep.equal([
      'created',
      'firstname',
      'lastname',
      'address',
    ])
  })

  it('should exclude strings', () => {
    const mapper = new ObjectMap(TEST_OBJECT, { include: { strings: false } })
    expect(mapper.get('user').properties.map((objmap) => objmap.name)).is.deep.equal(['created', 'address'])
  })

  it('should exclude objects', () => {
    const mapper = new ObjectMap(TEST_OBJECT, { include: { objects: false } })
    expect(mapper.root.properties.map((objmap) => objmap.name)).is.deep.equal(['logins'])
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

  it('should materialize object', () => {
    const mapper = new ObjectMap(TEST_OBJECT)
    const materialized = mapper.materialze()
    expect(materialized).to.deep.equal(TEST_OBJECT)
  })
})
