const mg=require('mongoose')

const schema_url = mg.Schema({
    url: String, 
    shortUrl: String,
    viewed: [{
        type: Date,
        default: Date.now
    }]
})

const model = mg.model("Model_url_shortner", schema_url);


module.exports={model}