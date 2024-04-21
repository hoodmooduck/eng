const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router()
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')))

router.get('/', function (req, res, next) {
    res.render('/')
})

const axios = require('axios');


app.post('/search', async (req, res) => {
    const targetWord = req.body.word.toLowerCase();
    const targetLang = req.body.opt;

    const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
            'to[0]': String(targetLang),
            'api-version': '3.0',
            profanityAction: 'NoAction',
            textType: 'plain'
        },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '12c9b46d17mshf348830b4b8224fp16edd4jsnd8562f1e471d',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
            {
                Text: targetWord
            }
        ]
    };



    try {
        const response = await axios.request(options);
        const translatedText = response.data[0].translations[0].text;
        const result2 = translatedText;

        fs.readFile('./f.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка чтения файла: ', err);
                return;
            }

            const lines = data.split('\n');
            let result = '';
            let includeTargetWord = false;
            let search = false;


            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (search) {
                    break;
                }
                if (line.toLowerCase().includes(targetWord)) {
                    includeTargetWord = true;
                    search = true;
                }
                if (includeTargetWord) {
                    result += line + `\n`;
                    const nextLine = lines[i + 1];
                    if (nextLine && nextLine.match(/^[a-z,A-Z]/)) {
                        result += '\n';
                        includeTargetWord = false;
                    } else {
                        break;
                    }
                }
            }

            // console.log(result);
            res.render('result', {result, result2});
        });
    } catch (error) {
        console.error(error);
        // Если произошла ошибка при запросе к API, сохраняем пустую строку в result2
        const result2 = '';
        fs.readFile('./f.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка чтения файла: ', err);
                return;
            }

            const lines = data.split('\n');
            let result = '';
            let includeTargetWord = false;
            let search = false;


            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (search) {
                    break;
                }
                if (line.toLowerCase().includes(targetWord)) {
                    includeTargetWord = true;
                    search = true;
                }
                if (includeTargetWord) {
                    result += line + `\n`;
                    const nextLine = lines[i + 1];
                    if (nextLine && nextLine.match(/^[a-z,A-Z]/)) {
                        result += '\n';
                        includeTargetWord = false;
                    } else {
                        break;
                    }
                }
            }

            // console.log(result);
            res.render('result', {result, result2});
        });
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});