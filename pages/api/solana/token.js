import { connectToDatabase } from '../../../server/database/mongodb'
import TokenModel from '../../../server/models/token.model'
import TagModel from '../../../server/models/tag.model'

export default async function handler(req, res) {
    await connectToDatabase()
    const { limit, skip, sort, text, tag} = req.body
    // console.log(tag)
    // console.log(text)

    let findObject = {}
    if(text !== "" && tag !== ""){
        findObject = {
            $and: [
                {$or: [
                    {name: { "$regex": '^' + text,  "$options": "i"}}, 
                    {symbol: { "$regex": '^' + text,  "$options": "i"}}
                ]},
                {tag: tag}
            ]
        }
    }
    else if(text !== "") findObject = {
        $or: [
            {name: { "$regex": '^' + text,  "$options": "i"}}, 
            {symbol: { "$regex": '^' + text,  "$options": "i"}}
        ]
    }
    else if(tag !== ""){
        findObject = { tag: tag }
    }

    console.log(findObject)

    const data = await TokenModel.find(findObject).limit(limit).skip(skip).sort(sort)
    
    res.send({
        tokens: data
    })
}
