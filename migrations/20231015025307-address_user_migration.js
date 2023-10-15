module.exports = {
  async up(db, client) {
    console.log('up');
    console.log(
      await db.collection('user').find({ address: { $exists: true } }),
    );
    await db.collection('user').updateMany(
      { address: { $exists: true } },
      {
        $set: {
          addressName: '$address.name',
          location: {
            type: 'Point',
            coordinates: ['$address.lng', '$address.lat'],
          },
        },
        $unset: {
          address: true,
        },
      },
    );
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    console.log('down');
    await db.collection('user').updateMany({}, { $unset: { addressName: '' } });

    // Remove the location field.
    await db.collection('user').updateMany({}, { $unset: { location: '' } });
  },
};
