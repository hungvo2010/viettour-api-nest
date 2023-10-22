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
      // {
      //   $unset: {
      //     textColor: 1,
      //     soundOption: 1,
      //     enableAutoRotate: 1,
      //     autoRotateSpeed: 1,
      //     autoHideInfospot: 1,
      //     autoHideShareButton: 1,
      //     lockHorizontalView: 1,
      //     privacyStatus: 1,
      //     editStatus: 1,
      //     isPasswordProtected: 1,
      //     password: 1,
      //   },
      // },
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
