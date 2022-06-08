/**
* @export safeBlockInThePast
* @summary this should resolve CI errors probably caused by using a block too far in the past
* @note value taken from
*   {@link github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-core/test/internal/hardhat-network/provider/interval-mining-provider.ts#L15}
*/

export const safeBlockInThePast = 11_200_000;
