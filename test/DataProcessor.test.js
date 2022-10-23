const assert = require('assert');

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
} = require('./mockData');

const DataProcessor = require('../src/DataProcessor');
const dataProcessor = new DataProcessor();

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

it('Rejects data with multiple 100 rows', () => {
  const dataValid = dataProcessor.checkDataValidity(
    mockCSVInternalDataArrMulti100Rows
  );
  assert.ok(!dataValid);
});

it('Rejects data with multiple 900 rows', () => {
  const dataValid = dataProcessor.checkDataValidity(
    mockCSVInternalDataArrMulti900Rows
  );
  assert.ok(!dataValid);
});

it('Rejects data with no 100 row', () => {
  const dataValid = dataProcessor.checkDataValidity(
    mockCSVInternalDataArrNo100
  );
  assert.ok(!dataValid);
});

it('Rejects data with no 200 row', () => {
  const dataValid = dataProcessor.checkDataValidity(
    mockCSVInternalDataArrNo200
  );
  assert.ok(!dataValid);
});

it('Rejects data with no 300 row', () => {
  const dataValid = dataProcessor.checkDataValidity(
    mockCSVInternalDataArrNo300
  );
  assert.ok(!dataValid);
});

it('Rejects data with no 900 row', () => {
  const dataValid = dataProcessor.checkDataValidity(
    mockCSVInternalDataArrNo900
  );
  assert.ok(!dataValid);
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

it('Rejects data blocks with invalid row start', () => {
  const dataBlocksValid = dataProcessor.checkBlocksValidity(
    mockDataBlockArrEmpty
  );
  assert(!dataBlocksValid);
});

it('Rejects empty data blocks', () => {
  const dataBlocksValid = dataProcessor.checkBlocksValidity(
    mockDataBlockArrInvalidRowStart
  );
  assert(!dataBlocksValid);
});
