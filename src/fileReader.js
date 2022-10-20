const fs = require('fs/promises');

const fileReader = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = fileReader;
