module.exports = {
  async up(db, client) {
    await db.collection('Scene').updateMany({}, [
      {
        $set: {
          config: {
            arrivalX: '$arrivalX',
            arrivalY: '$arrivalY',
            arrivalZ: '$arrivalZ',
          },
        },
      },
      {
        $unset: ['arrivalX', 'arrivalY', 'arrivalZ'],
      },
    ]);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
