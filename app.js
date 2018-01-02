const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3001;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Setting awal')
})

app.listen(port, () => {
  console.log('Server running on port', port);
});
