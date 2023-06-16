const { exec } = require("child_process");

const removeTestDB = async () => {
  return new Promise((resolve, reject) => {
    const deleteDB = exec(
      `rm ${process.env.DB_FILE} || true`,
      {
        env: process.env,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const runMigrations = async () => {
  return new Promise((resolve, reject) => {
    const migrate = exec(
      `npx sequelize-cli db:migrate`,
      {
        env: process.env,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};
const runSeeds = async () => {
  return new Promise((resolve, reject) => {
    const seed = exec(
      `npx sequelize-cli db:seed:all`,
      {
        env: process.env,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const resetDB = async () => {
  await removeTestDB();
  await runMigrations();
  await runSeeds();
};

module.exports = { resetDB };
