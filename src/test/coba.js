// Membuat data json secara otomatis dari pinterest

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const query = ""; // Mau cari apa?
const formatName = query.replace(/\s+/g, '-'); 
const apiUrl = `http://localhost:3333/search/pinterest?query=${encodeURIComponent(query)}`;

axios.get(apiUrl)
  .then(response => {
    const responseData = response.data;
    if (responseData.status === true) {
      const dataToWrite = JSON.stringify(responseData.result.data, null, 2);
      const fileName = `${formatName}.json`; 
      const filePath = path.join(__dirname, 'data', 'image', 'anime', fileName);

      fs.writeFile(filePath, dataToWrite, err => {
        if (err) {
          console.error('Gagal menulis file:', err);
        } else {
          console.log(`Data berhasil disimpan dalam file: ${fileName}`);
        }
      });
    } else {
      console.error('Message:', responseData.message);
    }
  })
  .catch(error => {
    console.error('Error hit API:', error);
  });
