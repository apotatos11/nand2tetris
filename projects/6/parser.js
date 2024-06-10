const { getDestBinary, getCompBinary, getJumpBinary } = require('./code');

const get16BitBinaryFromNumber = (number) => {
  return number.toString(2).padStart(16, '0');
};

const splitDestAndRest = (cCommand) => {
  const [dest, compAndJump] = cCommand.split('=');

  return { dest, compAndJump };
};

const splitCompAndJump = (compAndJump) => {
  const [comp, jump] = compAndJump.split(';');

  return { comp, jump };
};

const changeACommandTo16BitBinary = (aCommand) => {
  const aCommandNumber = Number(aCommand);
  const sixTeenbitBinary = get16BitBinaryFromNumber(aCommandNumber);

  return sixTeenbitBinary;
};

const changeCCommandTo16BitBinary = (cCommand) => {
  console.log('cCommand', cCommand);
  const C_COMMAND_START = '111';

  const { dest, compAndJump } = splitDestAndRest(cCommand);
  const { comp, jump } = splitCompAndJump(compAndJump);

  const destBinary = getDestBinary(dest);
  const compBinary = getCompBinary(comp);
  const jumpBinary = getJumpBinary(jump);

  const sixTeenbitBinary =
    C_COMMAND_START + compBinary + destBinary + jumpBinary;
  console.log('result sixTeenbitBinary', sixTeenbitBinary);

  return sixTeenbitBinary;
};

module.exports = {
  changeACommandTo16BitBinary,
  changeCCommandTo16BitBinary,
};
