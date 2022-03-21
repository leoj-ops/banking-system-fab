const mongoose = require("mongoose");
const url = 'mongodb://127.0.0.1:27017/account-data';
mongoose.connect(url)
.then(r => {console.log("mongo successful")})
.catch(e => {console.log("mongo unsuccessful", e)});

const accountSchema = new mongoose.Schema({
    accountno: String,
    balance: Number,
  })
  
  const Account = mongoose.model('Account', accountSchema)
  
  const account = new Account({
    account: '182003',
    balance: 1000,
  })
  
  account.save().then(result => {
    console.log('account saved!')
    mongoose.connection.close()
  })

  Account.find({}).then(result => {
    result.forEach(account => {
      console.log(account)
    })
    mongoose.connection.close()
  })




// {
//     "accountno": '182003',
//     "balance": 1000,
// },
// {
//     "accountno": '182040',
//     "balance": 1100,
// },
// {
//     "accountno": '182058',
//     "balance": 900,
// },
// {
//     "accountno": '182065',
//     "balance": 1000,
// }