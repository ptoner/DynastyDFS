const IPFS = require('ipfs')

let ipfs


export async function getIPFS() {

    if (ipfs) return ipfs

    ipfs = await IPFS.create({
        repo: './test/test-repos/' + Math.random().toString()

    })

    return ipfs
}