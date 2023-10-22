module.exports = {
  async up(db, client) {
    await db.collection('User').updateMany(
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
    await db.collection('User').updateMany({}, { $unset: { addressName: '' } });
    await db.collection('User').updateMany({}, { $unset: { location: '' } });
  },
};
