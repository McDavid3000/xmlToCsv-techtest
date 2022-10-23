/**
 * Reads .xml files
 *
 * @param {String} filePath The file path to be read from
 * @return {String} data read from file
 */
const fs = require('fs/promises');

const fileReader = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    return data;
  } catch (err) {
    console.log('File read failed:', err.message);
  }
};

module.exports = fileReader;
