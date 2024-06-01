module.exports = {
  async up(db, client) {
    let generatedIds = new Set();
    let generateId = (generatedIds) => {
      let newId;
  
      do {
        newId = Math.floor(1000000 + Math.random() * 9000000).toString();
      } while (generatedIds.has(newId));
  
      generatedIds.add(newId);
      return newId;
    };
    await db.collection('Tour').updateMany({}, [
      {
        $set: {
          tourId: generateId(generatedIds),
        },
      },
    ]);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },

  
};
