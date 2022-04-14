import { boostedMasterChefJoe_ABI, pairABI, erc20ABI, veJoeABI} from "./abi";
import { ethers } from "ethers";


const boostedMasterChefJoe_Address = '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F'
const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')
const joeInstance = new ethers.Contract(
    boostedMasterChefJoe_Address,
    boostedMasterChefJoe_ABI,
    provider)

async function masterChefAllocPoint() {
    const allocPointTotal = await joeInstance.totalAllocPoint()
    // console.log('allocpointjoe', allocPointTotal.toString())
    return allocPointTotal
}

async function joePerSec() {
    const joePerSec = await joeInstance.joePerSec()
    // console.log('joepersec', joePerSec.toString())
    return joePerSec;
}


//helper function probs going to be deprecated
async function poolInfo(num) {
    return joeInstance.poolInfo(num)
      .then(res => res)
        .then(data => data)
           
}

async function joePools() {
    const poolTotal = await joeInstance.poolLength()
    const poolArr =  [...Array(parseInt(poolTotal)).keys()]
    const pools = await Promise.all(poolArr.map((poolNum) => joeInstance.poolInfo(poolNum)))
    // const pools = poolArr.map(poolNum => poolInfo(poolNum))
    return pools
}

async function getPairInfo(pairAddress) {
    const joePair = new ethers.Contract(pairAddress, pairABI, provider)
    // const poolInfo = await joePair
    // console.log(poolInfo)
    // const token0Addr = await joePair.token0()
    // const token1Addr = await joePair.token1()
    // const cToken0 = new ethers.Contract(token0Addr, erc20ABI, provider)
    // const cToken1 = new ethers.Contract(token1Addr, erc20ABI, provider)
    // const token0Symbol = await cToken0.symbol()
    // const token1Symbol = await cToken1.symbol()
    // const totalSupply = await joePair.totalSupply()
    // const [reserve0, reserve1, t] = await joePair.getReserves()
    // const name = `${token0Symbol}-${token1Symbol}`
    // const klast = await joePair.kLast()
    // console.log('total',totalSupply.toString())
    // console.log('reserve0', reserve0.toString(), 'reserve1:', reserve1.toString(), '**', reserve0.toString()*reserve1.toString())
    // console.log('klast', klast.toString())
    return {poolInfo}
    
}
// klast == reserve1.toString() * reserve0.toString()




    

console.log('ZZZZZZ',joePools())

async function veJoeBalance(userAddress) {
    const veJoeAddress = '0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456';
    const veJoe = new ethers.Contract(veJoeAddress, veJoeABI, provider)
    const veJoeHolding = await veJoe.balanceOf(userAddress)
    const veJoeTotalSupply = await veJoe.totalSupply()
    // console.log('!!!vejoetotal',veJoeTotalSupply.toString())
    return {veJoeHolding, veJoeTotalSupply}
}
// console.log(veJoeBalance('0x45dC664635627C0FE5c7119fe5BE2C3D39Ea3e74'))


export {
    joePerSec,
    masterChefAllocPoint,
    joePools,
    getPairInfo
}