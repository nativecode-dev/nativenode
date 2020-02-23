import 'mocha'

import expect from './expect'

import { messageTypeOf } from '../src/Functions/MessageTypeOf'
import { LincolnMessageType } from '../src/Interfaces/LincolnMessageType'

describe('when using messageTypeOf', () => {
  const TEST_FLAGS: number = LincolnMessageType.debug | LincolnMessageType.info

  it('should check message type of debug', () => {
    expect(messageTypeOf(TEST_FLAGS, LincolnMessageType.debug)).to.be.true
  })

  it('should check message type not of trace', () => {
    expect(messageTypeOf(TEST_FLAGS, LincolnMessageType.trace)).to.be.false
  })
})
