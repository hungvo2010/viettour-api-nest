module.exports = {
  async up(db, client) {
    await db.collection('Hotspot').updateMany({}, [
      {
        $set: {
          config: {
            scale: '$scale',
            opacity: '$opacity',
            rotateDegree: '$rotateDegree',
            x: '$x',
            y: '$y',
            z: '$z',
            hotspotStyle: '$hotspotStyle',
          },
        },
      },
      {
        $unset: [
          'scale',
          'opacity',
          'rotateDegree',
          'x',
          'y',
          'z',
          'hotspotStyle',
        ],
      },
    ]);
  },

  async down(db, client) {
    await db.collection('Hotspot').updateMany({}, [
      {
        $set: {
          scale: '$config.scale',
          opacity: '$config.opacity',
          rotateDegree: '$config.rotateDegree',
          x: '$config.x',
          y: '$config.y',
          z: '$config.z',
          hotspotStyle: '$config.hotspotStyle',
        },
      },
      {
        $unset: ['config'],
      },
    ]);
  },
};
