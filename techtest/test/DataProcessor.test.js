const assert = require('assert');

const DataProcessor = require('../src/DataProcessor');
const dataProcessor = new DataProcessor();

// Mock data
const {
  mockCSVInternalDataArr,
  mockCSVInternalDataString,
  mockDataBlock0,
  mockDataBlock1,
  mockDataBlockArr,
  mockJSONDataObj,
  mockDataBlockArrEmpty,
  mockDataBlockArrInvalidRowStart,
  mockCSVInternalDataArrNo100,
  mockCSVInternalDataArrNo200,
  mockCSVInternalDataArrNo300,
  mockCSVInternalDataArrNo900,
  mockCSVInternalDataArrMulti100Rows,
  mockCSVInternalDataArrMulti900Rows,
} = require('./mockData');

it('Extracts a string containing only the contents of CSVInternalData', async () => {
  const CSVIntervalData =
    dataProcessor.extractInternalCSVString(mockJSONDataObj);
  assert.strictEqual(CSVIntervalData, mockCSVInternalDataString);
});

it('Converts CSVInternalData string to a 2D array', () => {
  const CSVArr = dataProcessor.jsonCSVStrToArr(mockCSVInternalDataString);
  assert.strictEqual(CSVArr[0].constructor, Array);
});

it('CSVInternalData 2D array contains no trailing empty elements', () => {
  const CSVArr = dataProcessor.jsonCSVStrToArr(mockCSVInternalDataString);
  for (let i = 0; i < CSVArr.length - 1; i++) {
    let rowLen = CSVArr[i].length;
    let lastElement = CSVArr[i][rowLen - 1];
    assert.notEqual(lastElement, '');
  }
});

it('Extracts correct header element', () => {
  const [CSVFileHeader, CSVFileTrailer] = dataProcessor.getHeaderAndTrailer(
    mockCSVInternalDataArr
  );
  assert.strictEqual(
    JSON.stringify(CSVFileHeader),
    JSON.stringify(['100', 'NEM12', '201801211010', 'MYENRGY', 'URENRGY'])
  );
});

it('Extracts correct trailer element', () => {
  const [CSVFileHeader, CSVFileTrailer] = dataProcessor.getHeaderAndTrailer(
    mockCSVInternalDataArr
  );
  assert.equal(CSVFileTrailer, '900');
});

it('Checks data for correct occurance of 100, 900, 200 and 300 rows', () => {
  const dataValid = dataProcessor.checkDataValidity(mockCSVInternalDataArr);
  assert.ok(dataValid);
});

it('Throws error if data contains multiple 100 rows', () => {
  assert.throws(() => {
    dataProcessor.checkDataValidity(mockCSVInternalDataArrMulti100Rows);
  });
});

it('Throws error if data contains multiple 900 rows', () => {
  assert.throws(() => {
    dataProcessor.checkDataValidity(mockCSVInternalDataArrMulti900Rows);
  });
});

it('Throws error if data has no 100 row', () => {
  assert.throws(() => {
    dataProcessor.checkDataValidity(mockCSVInternalDataArrNo100);
  });
});

it('Throws error if data has no 200 row', () => {
  assert.throws(() => {
    dataProcessor.checkDataValidity(mockCSVInternalDataArrNo200);
  });
});

it('Throws error if data has no 300 row', () => {
  assert.throws(() => {
    dataProcessor.checkDataValidity(mockCSVInternalDataArrNo300);
  });
});

it('Throws error if data has no 900 row', () => {
  assert.throws(() => {
    dataProcessor.checkDataValidity(mockCSVInternalDataArrNo900);
  });
});

it('Extracts file names', () => {
  const CSVFileNames = dataProcessor.getCSVFileNames(mockCSVInternalDataArr);
  assert.strictEqual(CSVFileNames[0], '12345678901');
  assert.strictEqual(CSVFileNames[1], '98765432109');
});

it('Extracts the seperate data blocks from the CSVArr', () => {
  const dataBlockArr = dataProcessor.getSeperateDataBlocks(
    mockCSVInternalDataArr
  );
  assert.strictEqual(
    JSON.stringify(dataBlockArr[0]),
    JSON.stringify(mockDataBlock0)
  );
  assert.strictEqual(
    JSON.stringify(dataBlockArr[1]),
    JSON.stringify(mockDataBlock1)
  );
});

it('Accepts valid data blocks', () => {
  const dataBlocksValid = dataProcessor.checkBlocksValidity(mockDataBlockArr);
  assert(dataBlocksValid);
});

it('Throws error if data block(s) have invalid row start', () => {
  assert.throws(() => {
    dataProcessor.checkBlocksValidity(mockDataBlockArrInvalidRowStart);
  });
});

it('Throws error if data block(s) are empty', () => {
  assert.throws(() => {
    dataProcessor.checkBlocksValidity(mockDataBlockArrEmpty);
  });
});
