/**
 * Function that extracts relevant data in preperation for writing and checks for valididty
 *
 * @param {String} data Raw .xml file data
 * @return {Array} [dataBlockArr, CSVFileNames, CSVFileHeader, CSVFileTrailer, dataBlocksValid] Data to write to .csv files.
 */

const xml2json = require('xml2json');

const processData = (data) => {
  // Convert XML string to JSON object for easier processing
  // Extract CSVIntervalData element and parse data points into an array, again for processing convenience
  const jsonObj = xmlToJson(data);
  const CSVIntervalData = extractInternalCSV(jsonObj);
  const CSVArr = jsonCSVObjToArr(CSVIntervalData);

  const dataValid = checkDataValidity(CSVArr);
  if (dataValid) {
    const [CSVFileHeader, CSVFileTrailer] = getHeaderAndTrailer(CSVArr);
    const CSVFileNames = getCSVFileNames(CSVArr);
    const dataBlockArr = getSeperateDataBlocks(CSVArr);
    const dataBlocksValid = checkBlocksValidity(dataBlockArr);

    return [
      dataBlockArr,
      CSVFileNames,
      CSVFileHeader,
      CSVFileTrailer,
      dataBlocksValid,
    ];
  } else {
    console.log('Data not valid');
  }
};

module.exports = processData;

// Converts XML string to JSON object and returns
function xmlToJson(data) {
  return xml2json.toJson(data, {
    object: true,
  });
}

// Extracts and returns the entire CSVInternalData object
function extractInternalCSV(jsonObj) {
  let key = Object.keys(jsonObj);
  return jsonObj[key].Transactions.Transaction.MeterDataNotification
    .CSVIntervalData;
}

// Converts CSVIntervalData object to an array and returns
function jsonCSVObjToArr(CSVObj) {
  // Splits the data into rows
  const csvArrRows = CSVObj.split(/\r?\n/);

  // Create an array by spliting each row at each comma
  let csvArrRowsCols = csvArrRows.map((element) => {
    const split = element.split(',');
    // Remove trailing empty element that is created by the trailing commas
    if (split[split.length - 1] === '') {
      split.pop();
    }
    return split;
  });

  return csvArrRowsCols;
}

// Extract the 100 and 900 row of data
// Return header and trailer for files
function getHeaderAndTrailer(CSVArr) {
  let CSVFileHeaderAndTRailer = [];
  for (const element of CSVArr) {
    if (element[0] === '100') {
      CSVFileHeaderAndTRailer[0] = element;
    }
    if (element[0] === '900') {
      CSVFileHeaderAndTRailer[1] = element;
    }
  }

  return CSVFileHeaderAndTRailer;
}

// Checks data contains the correct row start elements
// Returns bool
function checkDataValidity(CSVArr) {
  let dataTag100 = 0;
  let dataTag900 = 0;
  let dataTag200 = 0;
  let dataTag300 = 0;

  let dataValid = true;

  // Check each data row at element 0 and tally
  for (const element of CSVArr) {
    if (element[0] === '100') {
      dataTag100++;
    } else if (element[0] === '900') {
      dataTag900++;
    } else if (element[0] === '200') {
      dataTag200++;
    } else if (element[0] === '300') {
      dataTag300++;
    } else {
      dataValid = false;
    }
  }

  // Check for valid occurances of each data start element
  if (
    dataTag100 !== 1 ||
    dataTag900 !== 1 ||
    dataTag200 < 1 ||
    dataTag300 < 1
  ) {
    dataValid = false;
  }

  return dataValid;
}

// Check that all data blocks contain at least 1 300 row (i.e. are populated)
// Returns bool
function checkBlocksValidity(dataBlockArr) {
  let dataBlockArrValid = true;

  for (let i = 0; i < dataBlockArr.length; i++) {
    if (
      typeof dataBlockArr[i][1] === 'undefined' ||
      dataBlockArr[i][1][0] !== '300'
    ) {
      dataBlockArrValid = false;
    }
  }
  return dataBlockArrValid;
}

// Extracts files names from second field in the "200" row
function getCSVFileNames(CSVArr) {
  let CSVFileNames = [];
  for (const element of CSVArr) {
    if (element[0] === '200') {
      CSVFileNames.push(element[1]);
    }
  }
  return CSVFileNames;
}

// Breaks data into seperate blocks
// A single block of data is the "200" row of data, followed by the repeating rows after, until the next "200", or the "900" trailing line
// Returns an array containing the seperate blocks of data
function getSeperateDataBlocks(CSVArr) {
  // Get indexes where the data should be split
  let dataBreaks = [];
  for (let i = 0; i < CSVArr.length; i++) {
    if (CSVArr[i][0] === '200' || CSVArr[i][0] === '900') {
      dataBreaks.push(i);
    }
  }

  // Split CSVArr at the data break indexes and push into new array
  let dataBlockArr = [];
  for (let i = 0; i < dataBreaks.length - 1; i++) {
    dataBlockArr.push(CSVArr.slice(dataBreaks[i], dataBreaks[i + 1]));
  }

  return dataBlockArr;
}
