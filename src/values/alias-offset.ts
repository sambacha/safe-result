// @export L1_TO_L2_ALIAS_OFFSET
// @author Optimism
// @summary Constant representing the alias to apply to the msg.sender when a contract sends an L1 => L2
// message. We need this aliasing scheme because a contract can be deployed to the same address
// on both L1 and L2 but with different bytecode (address is not dependent on bytecode when using
// the standard CREATE opcode). We want to treat L1 contracts as having a different address while
// still making it possible for L2 contracts to easily reverse the aliasing scheme and figure out
// the real address of the contract that sent the L1 => L2 message.

export const L1_TO_L2_ALIAS_OFFSET = '0x1111000000000000000000000000000000001111'
