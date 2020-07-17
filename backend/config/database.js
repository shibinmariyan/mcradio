const mongoose = require('mongoose')


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var ip = require("ip");

const url = "mongodb://" + ip.address() + ":27017/communityradio";
console.log("url--------------------", url);
mongoose.connect(url, (error) => {
    error
        ?
        console.log(
            "have error",
            error
        ) :
        console.log("DB connected to " + url);
});