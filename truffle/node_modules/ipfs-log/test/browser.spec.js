'use strict'

const isNode = require('is-node')

// This file will be picked up by webpack into the
// tests bundle and the code here gets run when imported
// into the browser tests index through browser/run.js
if (!isNode) {
  // If in browser, put the fixture keys in local storage
  // so that Keystore can find them
  const keyA = require('./fixtures/keys/identity-keys/userA')
  const keyB = require('./fixtures/keys/identity-keys/userB')
  const keyC = require('./fixtures/keys/identity-keys/userC')
  const keyD = require('./fixtures/keys/identity-keys/userD')
  const keyE = require('./fixtures/keys/signing-keys/042750228c5d81653e5142e6a56d5551231649160f77b25797dc427f8a5b2afd650acca10182f0dfc519dc6d6e5216b9a6612dbfc56e906bdbf34ea373c92b30d7')
  const keyF = require('./fixtures/keys/signing-keys/045d10320c2a75982d55e7e487db235341ac0a09a36252de6f3e959b9e249841a4bf4cfb909ec8c801ceeb0679586312e1830a753800ee351da54eb20e401df592')
  const keyG = require('./fixtures/keys/signing-keys/04b69f2e4c69b7e1e981e423130a50eae1a3f6f3b4ba17e221f676c336ea318be05b782642ac981efc66532cf583a9a40d72d5c2c458c80df9709bc787599fce55')
  const keyH = require('./fixtures/keys/signing-keys/04e9224ee3451772f3ad43068313dc5bdc6d3f2c9a8c3a6ba6f73a472d5f47a96ae6d776de13f2fc2076140fd68ca900df2ca4862b06192adbf8f8cb18a99d69aa')
  /* global localStorage */
  localStorage.setItem('userA', JSON.stringify(keyA))
  localStorage.setItem('userB', JSON.stringify(keyB))
  localStorage.setItem('userC', JSON.stringify(keyC))
  localStorage.setItem('userD', JSON.stringify(keyD))
  localStorage.setItem('042750228c5d81653e5142e6a56d5551231649160f77b25797dc427f8a5b2afd650acca10182f0dfc519dc6d6e5216b9a6612dbfc56e906bdbf34ea373c92b30d7', JSON.stringify(keyE))
  localStorage.setItem('045d10320c2a75982d55e7e487db235341ac0a09a36252de6f3e959b9e249841a4bf4cfb909ec8c801ceeb0679586312e1830a753800ee351da54eb20e401df592', JSON.stringify(keyF))
  localStorage.setItem('04b69f2e4c69b7e1e981e423130a50eae1a3f6f3b4ba17e221f676c336ea318be05b782642ac981efc66532cf583a9a40d72d5c2c458c80df9709bc787599fce55', JSON.stringify(keyG))
  localStorage.setItem('04e9224ee3451772f3ad43068313dc5bdc6d3f2c9a8c3a6ba6f73a472d5f47a96ae6d776de13f2fc2076140fd68ca900df2ca4862b06192adbf8f8cb18a99d69aa', JSON.stringify(keyH))
}
