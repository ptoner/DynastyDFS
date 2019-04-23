// import * as IPFS from "typestub-ipfs";
import IPFS = require('ipfs')


import OrbitDB = require('orbit-db');


(async () => {

    let ipfs = new IPFS({
        EXPERIMENTAL: {pubsub: true}
    })

    ipfs.on('error', error => console.error(error.message))

    console.log('waiting ipfs...');
    await new Promise((resolve, reject) => ipfs.on('ready', resolve));
    console.log('ipfs is ready.');


    const orbitdb = await OrbitDB.createInstance(ipfs)
    const db = await orbitdb.docs('profile', { indexBy: 'name' })

    let profile = {
        name: "Pat",
        address: "here",
        followers: 40
    }

    const hash = await db.put(profile)

    let fetched = await db.get("Pat")

    console.log(fetched)


    // console.log('closing ipfs...');
    // await new Promise((resolve, reject) => ipfs.stop(() => resolve))
    // console.log('closed ipfs.');
})();