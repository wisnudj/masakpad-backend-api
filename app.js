
const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRouters = require('./routers/userRouters')
const resepRouters = require('./routers/resepRouters')
const recookRouters = require('./routers/recookRouters')
require('dotenv').config()
const port = process.env.PORT || 3001;


mongoose.connection.openUri(process.env.MONGO_URL, (err) => {
  if(err) console.log(err)
  console.log('Moongose connected')
})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', userRouters)
app.use('/resep', resepRouters)
app.use('/recook', recookRouters)

app.listen(port, () => {
  console.log('Server running on port', port);
});
