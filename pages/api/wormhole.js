import { connectToDatabase } from '../../server/database/mongodb'
import WormholeModel from '../../server/models/wormhole.model'

export default async function handler(req, res) {
    await connectToDatabase()
    const { limit, skip, sort, text} = req.body
    // console.log(tag)
    // console.log(text)

    let findObject = {}
    if(text !== ""){ 
        findObject = {symbol: { "$regex": '^' + text,  "$options": "i"}}
    }
    console.log(findObject)

    const data = await WormholeModel.find(findObject).limit(limit).skip(skip).sort(sort)
    
    res.send({
        tokens: data
    })
}
