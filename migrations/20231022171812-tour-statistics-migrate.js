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
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
