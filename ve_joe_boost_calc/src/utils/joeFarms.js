import boostedMasterChefJoe_ABI from "./abi";
import { ethers } from "ethers";


const boostedMasterChefJoe_Address = '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F'
const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')
const joeInstance = new ethers.Contract(
    boostedMasterChefJoe_Address,
    boostedMasterChefJoe_ABI,
    provider)

// console.log('joepersec',joeInstance.joePerSec())
async function joePerSec() {
    const joePerSec = await joeInstance.joePerSec()
    // console.log('joepersec', joePerSec.toString())
    return joePerSec.toString();
}

async function poolInfo(num) {
    return joeInstance.poolInfo(num)
      .then(res => res)
        .then(data => data)
           
}

async function JoePools() {
    const poolTotal = await joeInstance.poolLength()
    const poolArr =  [...Array(parseInt(poolTotal)).keys()]
    const pools = await Promise.all(poolArr.map((poolNum) => joeInstance.poolInfo(poolNum)))
    return pools
}

console.log('!@#@!#', JoePools())
export {
    joePerSec
}