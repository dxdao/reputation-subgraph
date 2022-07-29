const { ethers } = require('ethers');
const DxAvatarABI = require('./DxAvatar.json');

const provider = new ethers.providers.StaticJsonRpcProvider(
  'https://poa-xdai.gateway.pokt.network/v1/lb/610e4ed818656e00369b9ccc'
);

const contract = new ethers.Contract('0xe716EC63C5673B3a4732D22909b38d779fa47c3F', DxAvatarABI, provider);

contract.nativeReputation().then(console.log);
