const fs = require('fs');

const fileWriter = (
  dataBlocksArr,
  CSVFileNames,
  CSVFileHeader,
  CSVFileTrailer
) => {
  try {
    for (let i = 0; i < dataBlocksArr.length; i++) {
      const message = fs.createWriteStream(
        './outputFiles/' + CSVFileNames[i] + '.csv'
      );
      message.write(CSVFileHeader.toString());
      message.write('\n');

      dataBlocksArr[i].forEach((element) => {
        element.forEach((e) => {
          message.write(e);
          message.write(',');
        });
        message.write('\n');
      });
      message.write(CSVFileTrailer.toString());

      message.close();
    }
    return true;
  } catch (err) {
    console.log(err);
  }
};

module.exports = fileWriter;
