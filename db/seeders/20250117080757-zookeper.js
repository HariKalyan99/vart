const bcrypt = require('bcryptjs');
const config = require('../../config');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, _) => {
    let password = config.zookeeperpassword;
    let hashedPassword = bcrypt.hashSync(password, 10)
    return queryInterface.bulkInsert('animals', [
      {
        animalname: 'zookeper',
        email: config.zookeeperemail,
        password: hashedPassword,
        animalRole: 'zookeeper',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, _) => {
    return queryInterface.bulkDelete('animals', null, {});
  },
};