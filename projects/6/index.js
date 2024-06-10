const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { readAndProcessFiles } = require('./utils');

const argv = yargs
  .option('input', {
    alias: 'i',
    description: 'Input file path',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h').argv;

// 주어진 파일명과 동일한 파일명을 바탕으로 hackFiles폴더에 .hack파일로 파일을 저장한다.
const inputFilePath = path.resolve(argv.input);
const inputFileName = path.basename(inputFilePath, path.extname(inputFilePath));
const outputDir = path.resolve(__dirname, 'hackFiles');

const outputFilePath = path.join(outputDir, `${inputFileName}.hack`);

fs.access(outputDir, fs.constants.F_OK, (err) => {
  if (err) {
    // 디렉토리가 존재하지 않음
    fs.mkdir(outputDir, { recursive: true }, (err) => {
      if (err) {
        return console.error(`Failed to create directory: ${err.message}`);
      }
      console.log(`Directory created: ${outputDir}`);
      readAndProcessFiles(inputFilePath, outputFilePath);
    });
  } else {
    // 디렉토리가 존재함
    console.log(`Directory already exists: ${outputDir}`);
    readAndProcessFiles(inputFilePath, outputFilePath);
  }
});
