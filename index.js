
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router()
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')))

router.get('/', function(req, res, next) {
    res.render('/')
})

app.post('/search', (req, res) => {
  const targetWord = req.body.word.toLowerCase();

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
      if(search){
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
        }else{
          break;
        }
      }
    }
    // console.log(result);
    res.render('result', { result });
  });
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});