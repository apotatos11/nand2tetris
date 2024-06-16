const { getDestBinary, getCompBinary, getJumpBinary } = require('./code');

const get16BitsBinaryFromNumber = (number) => {
  return number.toString(2).padStart(16, '0');
};

const hasEqualSign = (string) => {
  if (!string) {
    return false;
  }

  return string.includes('=');
};

const hasSemiColon = (string) => {
  if (!string) {
    return false;
  }

  return string.includes(';');
};

const getDest = (cCommand) => {
  return hasEqualSign(cCommand) ? cCommand.split('=')[0] : null;
};

const getJump = (cCommand) => {
  return hasSemiColon(cCommand) ? cCommand.split(';')[1] : null;
};

const getComp = (cCommand) => {
  if (hasEqualSign(cCommand) && hasSemiColon(cCommand)) {
    return splitCompAndJump(splitDestAndRest(cCommand)['compAndJump'])['comp'];
  }

  if (hasEqualSign(cCommand) && !hasSemiColon(cCommand)) {
    return splitDestAndRest(cCommand)['compAndJump'];
  }

  if (!hasEqualSign(cCommand) && hasSemiColon(cCommand)) {
    return splitCompAndJump(cCommand)['comp'];
  }
};

const splitDestAndRest = (cCommand) => {
  const [dest, compAndJump] = cCommand.split('=');

  return { dest, compAndJump };
};

const splitCompAndJump = (compAndJump) => {
  const [comp, jump] = compAndJump.split(';');

  return { comp, jump };
};

const changeACommandTo16BitsBinary = (aCommand) => {
  const aCommandNumber = Number(aCommand);
  const sixTeenbitBinary = get16BitsBinaryFromNumber(aCommandNumber);

  return sixTeenbitBinary;
};

const changeCCommandTo16BitsBinary = (cCommand) => {
  const C_COMMAND_START = '111';

  const dest = getDest(cCommand);
  const comp = getComp(cCommand);
  const jump = getJump(cCommand);

  const destBinary = getDestBinary(dest);
  const compBinary = getCompBinary(comp);
  const jumpBinary = getJumpBinary(jump);

  const sixTeenbitBinary =
    C_COMMAND_START + compBinary + destBinary + jumpBinary;

  return sixTeenbitBinary;
};

module.exports = {
  changeACommandTo16BitsBinary,
  changeCCommandTo16BitsBinary,
};
