module.exports = {
  async up(db, client) {
    await db.collection('Tour').updateMany(
      { address: { $exists: true } },
      {
        $unset: {
          address: true,
        },
      },
    );
  },

  async down(db, client) {
    // todo
  },
};
