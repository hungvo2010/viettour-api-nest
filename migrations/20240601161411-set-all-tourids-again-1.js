module.exports = {
  async up(db, client) {
    let generateId = () => {
      return Math.floor(1000000 + Math.random() * 9000000).toString();
    };
    await db.collection('Tour').updateMany(
      {},
      {
        $set: {
          tourId: generateId(),
        },
      },
    );
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
