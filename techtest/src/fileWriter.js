/**
 * Writes .csv files for each data block provided
 *
 * @param {Array} dataBlocksArr The data to be written to file(s)
 * @param {number} CSVFileNames The names extracted for the file(s)
 * @param {number} CSVFileHeader The header data for the file(s)
 * @param {number} CSVFileTrailer The trailer data for the file(s)
 */

const fs = require('fs');

const fileWriter = (
  dataBlocksArr,
  CSVFileNames,
  CSVFileHeader,
  CSVFileTrailer
) => {
  try {
    // Iterate through each seperate block of data
    for (let i = 0; i < dataBlocksArr.length; i++) {
      // Open file stream and provide file name
      const message = fs.createWriteStream(
        './outputFiles/' + CSVFileNames[i] + '.csv'
      );
      message.write(CSVFileHeader.toString());
      message.write('\n');

      // Write each data element with a comma in between
      dataBlocksArr[i].forEach((element) => {
        element.forEach((e) => {
          message.write(e);
          message.write(',');
        });
        // Seperate each line of data
        message.write('\n');
      });
      message.write(CSVFileTrailer.toString());

      message.close();
    }
    console.log('File write complete');
  } catch (err) {
    console.log('File write failed:', err.message);
  }
};

module.exports = fileWriter;
