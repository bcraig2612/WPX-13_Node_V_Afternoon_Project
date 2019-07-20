// Set module.exports to an object that will store our methods.
module.exports = {
    // Create an async method called dragonTreasure with parameters req and res
    // This should get the database instance and run the get_dragon_treasure SQL file, passing in the number '1'.
    // Use the await keyword on the database query and store the result on a variable.
    // Return the result of this database query as the response with status 200.
    dragonTreasure: async (req, res) => {
      const treasure = await req.app.get('db').get_dragon_treasure(1);
      return res.status(200).send(treasure);
    },
    // create an async method called getUserTreasure with parameters req and res.
    // This should get the database instance and run the get_user_treasure SQL file, passing in the id from req.session.user.
    // Use the await keyword on the database query, and store the result on a variable.
    // Send the result of this database query as the response with status 200.
    getUserTreasure: async (req, res) => {
        const userTreasure = await req.app.get('db').get_user_treasure([req.session.user.id]);
        return res.status(200).send(userTreasure);
    },
    addUserTreasure: async (req, res) => {
      const { treasureURL } = req.body;
      const { id } = req.session.user;
      const userTreasure = await req.app
        .get("db")
        .add_user_treasure([treasureURL, id]);
      return res.status(200).send(userTreasure);
    },
    getAllTreasure: async (req, res) => {
      const allTreasure = await req.app.get("db").get_all_treasure();
      return res.status(200).send(allTreasure);
    }
  };