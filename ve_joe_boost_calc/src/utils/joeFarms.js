import boostedMasterChefJoe_ABI from "./abi";
import { ethers } from "ethers";


const boostedMasterChefJoe_Address = '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F'
const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')

async function joePerSec() {
    const joeInstance = new ethers.Contract(
        boostedMasterChefJoe_Address,
        boostedMasterChefJoe_ABI,
        provider)

    const joePerSec = await joeInstance.joePerSec()
    console.log('joepersec', joePerSec.toString())
    return joePerSec;
}

export {
    joePerSec
}