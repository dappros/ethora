const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./databasefile",
});

const Transaction = sequelize.define(
  "Transaction",
  {
    // Model attributes are defined here
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

sequelize.sync();

const main = async () => {
  await sequelize.sync();

  // await Transaction.create({
  //   transactionId: 123,
  // });

  const tx = await Transaction.findOne({ where: { transactionId: 123 } });
  // console.log("All users:", JSON.stringify(tx, null, 2));
};

main();

export default {
  Transaction,
};
