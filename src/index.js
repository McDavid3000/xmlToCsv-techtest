/**
 * Entry point for program
 * Reads in data
 * Processes data to confirm validity and for writing to file
 * Writes to file if all data is valid
 */

const fileReader = require('./fileReader');
const fileWriter = require('./fileWriter');
const processData = require('./processData');

const main = async () => {
  const data = await fileReader('./inputFiles/testfile.xml');

  [
    dataBlocksArr,
    CSVFileNames,
    CSVFileHeader,
    CSVFileTrailer,
    dataBlocksValid,
  ] = processData(data);

  // Write to file only if all blocks of data contain at least one 300 line
  if (dataBlocksValid) {
    fileWriter(dataBlocksArr, CSVFileNames, CSVFileHeader, CSVFileTrailer);
    console.log('File write complete');
  } else {
    console.log('At least one data block is invalid');
  }
};

main();
