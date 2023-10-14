const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment-timezone');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    fs.readFile('matches.json', 'utf8', (err, data) => {
        if (err) {
            scrapeData();
        } else {
            res.send(data);
        }
    });
});

app.get('/api/matches', (req, res) => {
    fs.readFile('matches.json', 'utf8', (err, data) => {
        if (err) {
            scrapeData();
        } else {
            res.send(data);
        }
    });
});

app.get('/api/refresh', (req, res) => {
    scrapeData();
    res.send("Data refreshed!");
});


function scrapeData() {
    axios.get('https://liquipedia.net/trackmania/Trackmania_World_Tour/2023/World_Championship')
        .then(response => {
            const $ = cheerio.load(response.data);
            let matches = [];
            $('.brkts-popup.brkts-match-info-popup').each((i, elem) => {
                let match = {};
                match.team1 = $(elem).find('.brkts-popup-header-opponent-left .name a').text() || 'TBD';
                match.team2 = $(elem).find('.brkts-popup-header-opponent-right .name a').text() || 'TBD';
                match.date = $(elem).find('.timer-object').attr('data-timestamp');
                let team1ImageUrl = $(elem).find('.brkts-popup-header-opponent-left .team-template-image-icon img').attr('src');
                if (team1ImageUrl) {
                    match.team1ImageUrl = downloadImage(team1ImageUrl);
                }
                let team2ImageUrl = $(elem).find('.brkts-popup-header-opponent-right .team-template-image-icon img').attr('src');
                if (team2ImageUrl) {
                    match.team2ImageUrl = downloadImage(team2ImageUrl);
                }
                match.team1result = $(elem).find('.brkts-popup-header-dev .brkts-popup-spaced .brkts-popup-spaced div:first-child').text();
                match.team2result = $(elem).find('.brkts-popup-header-dev .brkts-popup-spaced .brkts-popup-spaced div:nth-child(2)').text();

                matches.push(match);
            });
            matches = matches.sort((a, b) => a.date - b.date);
            fs.writeFile('matches.json', JSON.stringify(matches), 'utf8', err => {
                if (err) throw err;
            });
        })
        .catch(error => console.error(error));
}

function downloadImage(imageUrl, directory = 'public/images/') {
    let filename = imageUrl.split('/').pop();
    let path = directory + filename;

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            axios({
                url: 'https://liquipedia.net' + imageUrl,
                responseType: 'stream',
            }).then(
                response =>
                    new Promise((resolve, reject) => {
                        response.data
                            .pipe(fs.createWriteStream(path))
                            .on('finish', () => resolve())
                            .on('error', e => reject(e));
                    }),
            );
        }
    });
    return filename;
}


app.listen(3000, () => console.log('Server running on port https://localhost:3000'));
