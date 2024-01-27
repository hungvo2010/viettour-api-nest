module.exports = {
    up: async (db, client) => {
        await db.collection('Tour').updateMany(
            {
                "encodeUrl": { $exists: true }
            },
            [{
                $set: {
                    encodeUrl: { $concat: ['/tour/', '$encodeUrl'] },
                },
            }]
        );
    },
    down: async (db, client) => {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
}

