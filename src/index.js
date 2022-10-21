/**
 * Entry point for program
 * Reads in data
 * Processes data to confirm validity and for writing to file
 * Writes to file if all data is valid
 */

const fileReader = require('./fileReader');
const fileWriter = require('./fileWriter');

// Name these better
const DataProcessor = require('./DataProcessor');
const dataProcessor = new DataProcessor();
const xml2json = require('xml2json');

const main = async () => {
  const data = await fileReader('./inputFiles/testfile.xml');

  // Converts XML string to JSON object and returns
  const JSONObj = xml2json.toJson(data, {
    object: true,
  });

  const CSVIntervalData = dataProcessor.extractInternalCSV(JSONObj);
  const CSVArr = dataProcessor.jsonCSVObjToArr(CSVIntervalData);

  const dataValid = dataProcessor.checkDataValidity(CSVArr);
  if (dataValid) {
    const [CSVFileHeader, CSVFileTrailer] =
      dataProcessor.getHeaderAndTrailer(CSVArr);
    const CSVFileNames = dataProcessor.getCSVFileNames(CSVArr);
    const dataBlockArr = dataProcessor.getSeperateDataBlocks(CSVArr);
    const dataBlocksValid = dataProcessor.checkBlocksValidity(dataBlockArr);

    if (dataBlocksValid) {
      fileWriter(dataBlockArr, CSVFileNames, CSVFileHeader, CSVFileTrailer);
      console.log('File write complete');
    } else {
      console.log('At least one data block is invalid');
    }
  }
};

main();
