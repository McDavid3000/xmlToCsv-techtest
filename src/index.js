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
  let data;
  data = await fileReader('./inputFiles/testfile.xml');

  let JSONObj;
  if (data) {
    try {
      JSONObj = xml2json.toJson(data, {
        object: true,
      });
    } catch (err) {
      console.log('XML to JSON parse failed:', err.message);
    }
  }

  if (JSONObj) {
    const CSVIntervalData = dataProcessor.extractInternalCSVString(JSONObj);
    const CSVArr = dataProcessor.jsonCSVStrToArr(CSVIntervalData);

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
  }
};

main();
