function PredictionPool(){
  this.instance = null;
  this.predPerBlock;
  this.allocPoint;
  this.poolLength;
}

PredictionPool.prototype.withdraw = function (pId, amount) {
  return this.instance.withdraw(pId, amount);
}

PredictionPool.prototype.deposit = function (pId, amount) {
  return this.instance.deposit(pId, amount);
}

PredictionPool.prototype.userInfo = async function (pId, address) {
  return await this.instance.userInfo(pId, address);
}

PredictionPool.prototype.poolInfo = async function (index) {
  return await this.instance.poolInfo(index)
}

PredictionPool.prototype.wonRound = async function (address, index) {
  return await this.instance.wonRound(address, index)
}

PredictionPool.prototype.lostRound = async function (address, index) {
  return await this.instance.lostRound(address, index)
}



// specific pools
function WinnerPool(){
  PredictionPool(this);
}

WinnerPool.prototype = Object.create(PredictionPool.prototype);

WinnerPool.prototype.pendingPred = function (pId, address) {
  return this.instance.pendingCRP(pId, address);
}

WinnerPool.prototype.initialize = async function (address, abi, signer){
  this.instance = await new ethers.Contract(address, abi, signer);
  this.allocPoint = await this.instance.allocPoint();
  this.poolLength = await this.instance.getPoolLength();

  const multiplier = await this.instance.BONUS_MULTIPLIER();
  const predPerBlock = await this.instance.CRPPerBlock();
  this.predPerBlock = multiplier.mul(predPerBlock);
}

Object.defineProperty(WinnerPool.prototype, 'constructor', {
    value: WinnerPool,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true 
  }
);


function LoserPool(){
  PredictionPool(this);
}

LoserPool.prototype = Object.create(PredictionPool.prototype);

LoserPool.prototype.pendingBID = function (pId, address) {
  return this.instance.pendingRewardToken(pId, address);
}

LoserPool.prototype.initialize = async function (address, abi, signer){
  this.instance = await new ethers.Contract(address, abi, signer);
  this.allocPoint = await this.instance.allocPoint();
  this.poolLength = await this.instance.getPoolLength();

  const multiplier = await this.instance.BONUS_MULTIPLIER();
  const bidPerBlock = await this.instance.rewardTokenPerBlock();
  this.bidPerBlock = multiplier.mul(bidPerBlock);
}

Object.defineProperty(LoserPool.prototype, 'constructor', {
    value: LoserPool,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true 
  }
);

