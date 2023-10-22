module.exports = {
  async up(db, client) {
    await db.collection('Tour').updateMany({ creator: { $exists: true } }, [
      {
        $set: {
          creatorId: '$creator.userId',
        },
      },
    ]);
  },

  async down(db, client) {
    await db.collection('Tour').updateMany(
      { creatorId: { $exists: true } },
      {
        $unset: {
          creatorId: '',
        },
      },
    );
  },
};
