const {
  DEST_TABLE,
  COMP_TABLE_FOR_1,
  COMP_TABLE_FOR_0,
  JUMP_TABLE,
} = require('./constant');

const hasCompM = (comp) => {
  return comp.includes('M');
};

const getDestBinary = (destString) => {
  return DEST_TABLE.get(destString ?? 'null');
};

const getCompBinary = (compString) => {
  const result = hasCompM(compString)
    ? COMP_TABLE_FOR_1.get(compString)
    : COMP_TABLE_FOR_0.get(compString);

  return result;
};

const getJumpBinary = (jumpString) => {
  return JUMP_TABLE.get(jumpString ?? 'null');
};

module.exports = {
  getCompBinary,
  getDestBinary,
  getJumpBinary,
};
