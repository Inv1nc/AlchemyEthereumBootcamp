const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // TODO: how do we prove to the server we're on the nice list? 
  const name = "Ruby Stark";

  const merkleTree = new MerkleTree(niceList);

  const index = niceList.findIndex(ind => ind == name);
  const proof = merkleTree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    // TODO: add request body parameters here!
    name: name,
    proof: proof
  }).catch((error) => {
    console.log(error);
  });

  console.log({ gift });
}

main();
