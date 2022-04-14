const exchangeQuery = `
        query {
            masterChefs {
                totalAllocPoint
            }
            pools {
                id
                pair
                allocPoint
                rewarder {
                  rewardToken
                  name
                  decimals
                  tokenPerSec
                }
            }
        }
    `

    const pairsQuery = `
        query($ids: [ID], $user_id: ID) {
            user(id: $user_id) {
                id
                liquidityPositions(where:{id_in: $ids}) {
                    id
                    liquidityTokenBalance
                }
            }
            pairs(where: {id_in: $ids}) {
                id
                name
                token0Price
                token1Price
                reserve0
                reserve1
                totalSupply
                reserveUSD
                volumeUSD
                volumeToken0
                volumeToken1
                token0 {
                    id
                    symbol
                }
                token1 {
                    id
                    symbol
                }
              }
        }
    `

    const veJoeQuery = `
    query($id: ID) {
        veJoes(first: 5) {
          id
          joeStaked
          joeStakedUSD
          totalVeJoeMinted
        }
        user(id: $id) {
            id
            veJoeBalance
        }
    }
    `

export {
    exchangeQuery,
    pairsQuery,
    veJoeQuery
}