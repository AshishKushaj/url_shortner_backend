const {model} = require('../model/models')


function generateCode(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
}


async function createLink(req,res){
    const body=req.body;
    if(!body.url)
        return res.status(400).json({err:"no url sent in body"}) 
    
    const code=body.code;
     let shortCode;

     if (code) {
       const valid = /^[A-Za-z0-9]{6,8}$/.test(code);
       if (!valid) {
         return res
           .status(400)
           .json({ error: "code must match [A-Za-z0-9]{6,8}" });
       }
       shortCode = code;
     } else {
       shortCode = generateCode(8); 
     }



    try {
      const duplicate = await model.findOne({ shortUrl: shortCode });
      if (duplicate)
        return res
          .status(409)
          .json({ duplicate: `code alredy exist` });

    } catch (err) {
      console.log(`error during finding for duplicate => ${err}`);
      return res
        .status(400)
        .json({ error: "error during finding for duplicate" });
    }


    const entry = new model({
      url: body.url,
      shortUrl: shortCode,
    });


    try{
        await entry.save()
        console.log("saved entry")
    }
    catch(err){
        console.log(`err at saving entry in db  ==> ${err}` );
        return res.status(400).json({ err: "err at saving entry in db" });
    }

    return res.status(200).json({ shortUrl: shortCode });
}


async function redirectToRealUrl(req,res){
    const id = req.params.code;

    if (!id)
      return res.status(400).json({ err: "no link provided" });

    try{
        const data= await model.findOneAndUpdate(
            {shortUrl:id},
            {$push: {
                viewed:Date.now()
            }}
        )

        if(!data)
            return res.status(404).json({err:"no such link found"})

        return res.redirect(302, data.url);
    }
    catch(err){
        return res
          .status(500)
          .json({
            error: `Something went wrong while finding ==> ${err}` 
          });
    }

}


async function listAllLinks(req,res){
    try{
        const data= await model.find();
        return res.status(200).json(data);    
    }
    catch(err){
        console.log("error during fetching all data");
        return res.status(400).json({error:`err during fetching all data  =>  ${err}`})
    }

}


async function statsForOneCode(req,res){
    const code= req.params.code;

    try{
        const data= await model.findOne({shortUrl:code});

        if(!data)return res.status(404).json({err:"code not found"});

        return res.status(200).json(data)
    }
    catch(err){
        console.log(`error during findnig in db =>  ${err}` );
        return res
          .status(500)
          .json({ error: `error during findnig in db => ${err}` });
    }

}


async function deleteCode(req,res){
    const code = req.params.code;

    try{
        await model.findOneAndDelete({shortUrl:code});
        return res.status(200).json({message:"code deleted"})
    }
    catch(err){
        console.log(
          `error during finding or deleting in db func(deleteCode) => ${err} `
        );
        return res
          .status(500)
          .json({
            error:`error during finding or deleting in db func(deleteCode) => ${err}`
          });
    }
}


module.exports = {
  createLink,
  redirectToRealUrl,
  listAllLinks,
  statsForOneCode,
  deleteCode,
};