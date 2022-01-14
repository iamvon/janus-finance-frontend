import { connectToDatabase } from '../../../server/database/mongodb'
import TagModel from '../../../server/models/tag.model'
// import TokenModel from '../../../server/models/tokenModel'
// import PlatformModel from '../../../server/models/platformModel'
// import InvestorModel from '../../../server/models/investorModel'

export default async function handler(req, res) {
    await connectToDatabase()
    
    const data = await TagModel.find({})

    res.send({
        tags: data
    })
}
