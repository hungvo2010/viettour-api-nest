module.exports = {
    up: async (db, client) => {
        await db.collection('Tour').updateMany(
            {},
            {
                $set: {
                    encodeUrl: '/tour/' + '$encodeUrl',
                },
            },
        )
    },
    down: async (db, client) => {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
}

