import * as CryptoJS from "crypto-js";

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "20202020202", "", "hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLastestchain = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLastestchain();
  const newIndex: number = previousBlock.index + 1;
  const nextTimeStamp: number = getNewTimeStamp();
  const nextHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    nextTimeStamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    nextHash,
    previousBlock.hash,
    data,
    nextTimeStamp
  );
  addBlock(newBlock);
  return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

const isBlockValid = (
  candidiateBlock: Block,
  previousBlock: Block
): boolean => {
  if (!Block.validateStructure(candidiateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidiateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidiateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidiateBlock) !== candidiateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLastestchain())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);
export {};
