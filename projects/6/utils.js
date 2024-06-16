const fs = require('fs');
const readline = require('readline');

const {
  changeACommandTo16BitBinary,
  changeCCommandTo16BitBinary,
} = require('./parser');
const { SYMBOL_TABLE } = require('./constant');

const updateLabelLineByLine = async (filePath) => {
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
    const isACommand = trimmedLine.startsWith('@');
    const isLabel = trimmedLine.startsWith('(');

    if (isComment) {
      continue;
    }

    if (isWhiteSpace) {
      continue;
    }

    if (isLabel) {
      const labelName = trimmedLine.slice(1, -1);
      SYMBOL_TABLE.set(labelName, currentLineNumber + 1);
    }

    if (isACommand) {
      currentLineNumber += 1;
    } else {
      // CComaand일대
      currentLineNumber += 1;
    }
  }
};

const printFileLineByLine = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentVariableValue = 16;
  let outputData = '';
  const binaryLines = [];

  for await (const line of rl) {
    const trimmedLine = line.trim();

    const isComment = trimmedLine.startsWith('//');
    const isWhiteSpace = trimmedLine.length === 0;
    const isACommand = trimmedLine.startsWith('@');

    if (isComment) {
      continue;
    }

    if (isWhiteSpace) {
      continue;
    }

    let binaryLine;

    if (isACommand) {
      const aCommand = trimmedLine.slice(1);
      const isACommandNumber = !isNaN(Number(aCommand));

      if (isACommandNumber) {
        binaryLine = changeACommandTo16BitBinary(aCommand);
        binaryLines.push(binaryLine);

        continue;
      }

      const hasSymbolInTable = SYMBOL_TABLE.has(aCommand);

      if (hasSymbolInTable) {
        // aCommand 기호가 있는지 기호테이블에서 조회
        // 있으면 기호에 대응하는 숫자값으로 교체
        const targetSymbol = aCommand;
        const aCommandNumber = SYMBOL_TABLE.get(targetSymbol);
        binaryLine = changeACommandTo16BitBinary(aCommandNumber);
      } else {
        // 테이블에 없다면 그 기호는 새로운 변수
        // 새로운 변수 기호테이블에 담기
        // 새로운 변수 숫자로 변환해서 처리하기.
        const newSymbol = aCommand;
        SYMBOL_TABLE.set(newSymbol, currentVariableValue);
        binaryLine = changeACommandTo16BitBinary(currentVariableValue);
        currentVariableValue += 1;
      }
    } else {
      binaryLine = changeCCommandTo16BitBinary(trimmedLine);
    }

    binaryLines.push(binaryLine);
  }

  return binaryLines.join('\n');
};

const readAndProcessFiles = async (inputFilePath, outputFilePath) => {
  try {
    await updateLabelLineByLine(inputFilePath);
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
