module.exports = {
  async up(db, client) {
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
    await db.collection('user').updateMany({}, { $unset: { addressName: '' } });

    // Remove the location field.
    await db.collection('user').updateMany({}, { $unset: { location: '' } });
  },
};
