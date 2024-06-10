const fs = require('fs');
const readline = require('readline');

const {
  changeACommandTo16BitBinary,
  changeCCommandTo16BitBinary,
} = require('./parser');

const printFileLineByLine = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let outputData = '';

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
      binaryLine = changeACommandTo16BitBinary(aCommand);
    } else {
      binaryLine = changeCCommandTo16BitBinary(trimmedLine);
    }

    outputData += binaryLine + '\n';
  }

  return outputData;
};

const readAndProcessFiles = async (inputFilePath, outputFilePath) => {
  try {
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
