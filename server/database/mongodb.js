const mongoose = require("mongoose");

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        cached.promise = await mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            console.log("connected db")
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}
  