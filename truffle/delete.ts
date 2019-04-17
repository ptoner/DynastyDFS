// import * as IPFS from "typestub-ipfs";
import IPFS = require('ipfs')


import OrbitDB = require('orbit-db');


(async () => {

    let node = new IPFS({
        EXPERIMENTAL: {pubsub: true}
    })

    node.on('error', error => console.error(error.message))

    console.log('waiting node...');
    await new Promise((resolve, reject) => node.on('ready', resolve));
    console.log('node is ready.');


    const orbitdb = await OrbitDB.createInstance(node)
    const db = await orbitdb.keyvalue('first-database')



    console.log('adding file...');
    // FIXME first argument cannot be string?
    let files = await node.files.add(new Buffer('hello'));
    console.log('added file:', {files});

    let hash = files[0].hash;
    console.log('getting file...');
    let res = await node.files.get(hash);
    console.log('got file:', {res});

    console.log('closing node...');
    await new Promise((resolve, reject) => node.stop(() => resolve))
    console.log('closed node.');
})();