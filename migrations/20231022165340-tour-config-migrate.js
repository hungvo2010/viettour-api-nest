module.exports = {
  async up(db, client) {
    await db.collection('Tour').updateMany({}, [
      {
        $set: {
          config: {
            textColor: '$textColor',
            soundOption: '$soundOption',
            enableAutoRotate: '$enableAutoRotate',
            autoRotateSpeed: '$autoRotateSpeed',
            autoHideInfospot: '$autoHideInfospot',
            autoHideShareButton: '$autoHideShareButton',
            lockHorizontalView: '$lockHorizontalView',
            privacyStatus: '$privacyStatus',
            editStatus: '$editStatus',
            isPasswordProtected: '$isPasswordProtected',
            password: '$password',
          },
        },
      },
    ]);
  },

  async down(db, client) {
    await db.collection('Tour').updateMany(
      { config: { $exists: true } },
      {
        $unset: {
          config: 1,
        },
      },
    );
  },
};
