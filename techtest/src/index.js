/**
 * Entry point for program
 * Reads in data
 * Processes data to confirm validity and for writing to file
 * Writes to file if all data is valid
 */
const xml2json = require('xml2json');

const fileReader = require('./fileReader');
const fileWriter = require('./fileWriter');

const DataProcessor = require('./DataProcessor');
const dataProcessor = new DataProcessor();

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

    let dataValid;
    try {
      dataValid = dataProcessor.checkDataValidity(CSVArr);
    } catch (err) {
      console.log(err.message);
    }
    if (dataValid) {
      const [CSVFileHeader, CSVFileTrailer] =
        dataProcessor.getHeaderAndTrailer(CSVArr);
      const CSVFileNames = dataProcessor.getCSVFileNames(CSVArr);
      const dataBlockArr = dataProcessor.getSeperateDataBlocks(CSVArr);

      let dataBlocksValid;
      try {
        dataBlocksValid = dataProcessor.checkBlocksValidity(dataBlockArr);
      } catch (err) {
        console.log(err.message);
      }

      if (dataBlocksValid) {
        fileWriter(dataBlockArr, CSVFileNames, CSVFileHeader, CSVFileTrailer);
      }
    }
  }
};

main();
