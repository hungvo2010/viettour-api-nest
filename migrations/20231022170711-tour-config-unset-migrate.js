module.exports = {
  async up(db, client) {
    await db.collection('Tour').updateMany(
      {},
      {
        $unset: {
          textColor: '',
          soundOption: '',
          enableAutoRotate: '',
          autoRotateSpeed: '',
          autoHideInfospot: '',
          autoHideShareButton: '',
          lockHorizontalView: '',
          privacyStatus: '',
          editStatus: '',
          isPasswordProtected: '',
          password: '',
        },
      },
    );
  },

  async down(db, client) {
    await db.collection('Tour').updateMany(
      {
        config: { $exists: true },
      },
      [
        {
          $set: {
            textColor: '$config.textColor',
            soundOption: '$config.soundOption',
            enableAutoRotate: '$config.enableAutoRotate',
            autoRotateSpeed: '$config.autoRotateSpeed',
            autoHideInfospot: '$config.autoHideInfospot',
            autoHideShareButton: '$config.autoHideShareButton',
            lockHorizontalView: '$config.lockHorizontalView',
            privacyStatus: '$config.privacyStatus',
            editStatus: '$config.editStatus',
            isPasswordProtected: '$config.isPasswordProtected',
            password: '$config.password',
          },
        },
      ],
    );
  },
};
