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
                const lis = $(this).find('li');
                let index = 0;

                lis.each(function () {
                    if (index >= 0 && index <= 3) {
                        const text = $(this).text();
                        const colonIndex = text.indexOf(':');
                        if (colonIndex !== -1) {
                            const name = text.substring(colonIndex + 1).trim();
                            const words = name.split(',').map(word => word.trim());
                            articles.push(...words);
                            console.log(words);
                        }
                    }
                    index++;
                });
            });


            const strippedArticles = articles.slice(0);
            strippedArticles.splice(-16);
            const randomizedArticles = shuffleArray(strippedArticles);

            res.json(randomizedArticles);
        }).catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
