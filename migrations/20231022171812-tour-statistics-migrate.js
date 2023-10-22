module.exports = {
  async up(db, client) {
    await db.collection('Tour').updateMany({}, [
      {
        $set: {
          statistic: {
            likeCount: '$likeCount',
            viewCount: '$viewCount',
          },
        },
      },
      {
        $unset: ['likeCount', 'viewCount'],
      },
    ]);
  },

  async down(db, client) {
    await db.collection('Tour').updateMany({ statistic: { $exists: true } }, [
      {
        $set: {
          likeCount: '$statistic.likeCount',
          viewCount: '$statistic.viewCount',
        },
      },
      {
        $unset: ['statistic'],
      },
    ]);
  },
};
