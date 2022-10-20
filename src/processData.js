const xml2json = require('xml2json');

const processData = (data) => {
  let jsonObj = xmlToJson(data);
  const CSVIntervalData = extractInternalCSV(jsonObj);
  let csvArr = jsonCSVObjToArr(CSVIntervalData);

  const dataValid = checkDataValidity(csvArr);
  if (dataValid) {
    // Extract the file header and trailer
    const [CSVFileHeader, CSVFileTrailer] = getHeaderAndTrailer(csvArr);
    // Extract the files names of each data block
    const CSVFileNames = getCSVFileNames(csvArr);
    //change this from chunks to blocks
    dataChunks = getSeperateDataBlocks(csvArr);
    const dataBlocksValid = checkChunkValidity(dataChunks);

    return [
      dataChunks,
      CSVFileNames,
      CSVFileHeader,
      CSVFileTrailer,
      dataBlocksValid,
    ];
  } else {
    console.log('data not valid');
    //  throw console.error('Data not valid');
  }
};

module.exports = processData;

function xmlToJson(data) {
  return xml2json.toJson(data, {
    object: true,
  });
}

function extractInternalCSV(jsonObj) {
  let key = Object.keys(jsonObj);
  return jsonObj[key].Transactions.Transaction.MeterDataNotification
    .CSVIntervalData;
}

function jsonCSVObjToArr(CSVObj) {
  const csvArrRows = CSVObj.split(/\r?\n/);

  // Split each row at each comma
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

function checkDataValidity(CSVArr) {
  let dataTag100 = 0;
  let dataTag900 = 0;
  let dataTag200 = 0;
  let dataTag300 = 0;

  let dataValid = true;

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

// Check that all data blocks contain at least 1 300 row
function checkChunkValidity(dataBlock) {
  let dataBlockArrValid = true;

  for (let i = 0; i < dataChunks.length; i++) {
    if (
      typeof dataChunks[i][1] === 'undefined' ||
      dataChunks[i][1][0] !== '300'
    ) {
      console.log('its');
      dataBlockArrValid = false;
    }
  }
  return dataBlockArrValid;
}

function getCSVFileNames(csvArr) {
  let CSVFileNames = [];
  for (const element of csvArr) {
    if (element[0] === '200') {
      CSVFileNames.push(element[1]);
    }
  }
  return CSVFileNames;
}

function getSeperateDataBlocks(csvArr) {
  let dataBreaks = [];
  for (let i = 0; i < csvArr.length; i++) {
    if (csvArr[i][0] === '200' || csvArr[i][0] === '900') {
      dataBreaks.push(i);
    }
  }

  let dataChunks = [];

  // dataBreaks 1, 8, 15
  // Create an array containing seperate data chunks
  for (let i = 0; i < dataBreaks.length - 1; i++) {
    dataChunks.push(csvArr.slice(dataBreaks[i], dataBreaks[i + 1]));
  }

  return dataChunks;
}
