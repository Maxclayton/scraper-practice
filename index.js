function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const url = 'https://word.tips/todays-nyt-connections-answers/';

app.get('/', function (req, res) {
    res.json('This is my webscraper');
});

app.get('/results', (req, res) => {
    axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const articles = [];

            $('.prismic-serialized-text', html).each(function () {
                const lis = $(this).find('li'); // Select all <li> elements within the current .prismic-serialized-text element
                let index = 0; // Counter to track the index

                lis.each(function () { // Iterate over each <li> element
                    if (index >= 0 && index <= 3) { // Check if the index falls within the range 4th - 7th item
                        const text = $(this).text(); // Get the text content of the current <li> element
                        const colonIndex = text.indexOf(':'); // Find the index of colon
                        if (colonIndex !== -1) { // If colon exists
                            const name = text.substring(colonIndex + 1).trim(); // Get text after colon
                            const words = name.split(',').map(word => word.trim()); // Split by commas and remove extra spaces
                            articles.push(...words); // Push each word individually
                            console.log(words);
                        }
                    }
                    index++; // Increment the index counter
                });
            });
            
            // Slice off the first 4 elements of the articles array
             const strippedArticles = articles.slice(0);
             strippedArticles.splice(-16);
            // Randomize the order of strippedArticles
            const randomizedArticles = shuffleArray(strippedArticles);
            
            res.json(randomizedArticles);
            // console.log(randomizedArticles);
        }).catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
