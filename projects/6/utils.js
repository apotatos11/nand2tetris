const fs = require('fs');
const readline = require('readline');

const {
  changeACommandTo16BitsBinary,
  changeCCommandTo16BitsBinary,
} = require('./parser');
const { SYMBOL_TABLE } = require('./constant');

const updateLabelToSymbolTableLineByLine = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentLineNumber = 0;

  for await (const line of rl) {
    const trimmedLine = line.trim();

    const isComment = trimmedLine.startsWith('//');
    const isWhiteSpace = trimmedLine.length === 0;
    const isLabel = trimmedLine.startsWith('(');

    if (isComment) {
      continue;
    }

    if (isWhiteSpace) {
      continue;
    }

    if (isLabel) {
      const labelName = trimmedLine.slice(1, -1);
      SYMBOL_TABLE.set(labelName, currentLineNumber);
      continue;
    }

    currentLineNumber += 1;
  }
};

const printFileLineByLine = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentVariableValue = 16;
  const binaryLines = [];

  for await (const line of rl) {
    const trimmedLine = line.trim();

    const isComment = trimmedLine.startsWith('//');
    const isWhiteSpace = trimmedLine.length === 0;
    const isACommand = trimmedLine.startsWith('@');
    const isLabel = trimmedLine.startsWith('(');

    if (isComment) {
      continue;
    }

    if (isWhiteSpace) {
      continue;
    }

    if (isLabel) {
      continue;
    }

    let binaryLine; // 16BitsBinary
    const isCCommand = !isACommand;

    if (isCCommand) {
      binaryLine = changeCCommandTo16BitsBinary(trimmedLine);
      binaryLines.push(binaryLine);

      continue;
    }

    const aCommand = trimmedLine.slice(1);
    const isACommandNumber = !isNaN(Number(aCommand));

    if (isACommandNumber) {
      binaryLine = changeACommandTo16BitsBinary(aCommand);
      binaryLines.push(binaryLine);

      continue;
    }

    const hasSymbolInTable = SYMBOL_TABLE.has(aCommand);

    if (hasSymbolInTable) {
      const targetSymbol = aCommand;
      const aCommandNumber = SYMBOL_TABLE.get(targetSymbol);

      binaryLine = changeACommandTo16BitsBinary(aCommandNumber);
    } else {
      const newSymbol = aCommand;

      SYMBOL_TABLE.set(newSymbol, currentVariableValue);
      binaryLine = changeACommandTo16BitsBinary(currentVariableValue);
      currentVariableValue += 1;
    }

    binaryLines.push(binaryLine);
  }

  return binaryLines.join('\n');
};

const readAndProcessFiles = async (inputFilePath, outputFilePath) => {
  try {
    await updateLabelToSymbolTableLineByLine(inputFilePath);
    const outputData = await printFileLineByLine(inputFilePath);

    fs.writeFile(outputFilePath, outputData, 'utf8', (err) => {
      if (err) {
        console.error('파일을 쓰는 중 오류가 발생했습니다:', err);
        return;
      }
      console.log('변환된 파일이 저장되었습니다:', outputFilePath);
    });
  } catch (err) {
    console.error('파일을 처리하는 중 오류가 발생했습니다:', err);
  }
};

module.exports = {
  printFileLineByLine,
  readAndProcessFiles,
};
