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

  if (dataBlocksValid) {
    fileWriter(dataBlocksArr, CSVFileNames, CSVFileHeader, CSVFileTrailer);
    console.log('File write complete');
  } else {
    console.log('Datablock(s) invalid');
  }
};

main();

//Be consistent with variable names Caps etc
//Comment and tidy code
//Consider clasees buty unlikley
// write readme
// write tests
// upload to github
//conditions for data validity
//errors to throw if bad
//change fs, fs

// what i would
// remove invalid data (or otherwsie notify user, depedning on what is most appropraite for business)
// extract into seperate modular componenets
//iterate over data less
//check data more boeofre processing so much
//actual file anmes oK?
//currently rejects when only one chunk is invalid

//DOES NOT
// test for no file
// test for not XML
// Test for not correct XML

// test for
// Valid rows within the CSVIntervalData element can only start with "100", "200", "300","900"
// The CSVIntervalData element should contain at least 1 row for each of "100", "200", "300","900"
// "100", "900" rows should only appear once inside the CSVIntervalData element
// "200" and "300" can repeat and will be within the header and trailer rows
// "200" row must be followed by at least 1 "300" row
//consider a class for data processor
//need to check if the file is there beofre parsing
//need to check the file is valid
//parse to JSON first ?
//add debug opportunites
//record thinking
//comments

//needs more robust error detection and reporting
