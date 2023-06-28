/*'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
*/

const Sequelize = require("sequelize");
const config = require("../config/config.json");

const { username, password, database, host, dialect } = config.development;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

//Member모델은 sequelize객체를 사용해서 초기화를 하고 이를 통해서 DB에 존재하는
//Members테이블을 인식할 수 있게 된다.
//이 코드가 실행되면 Member모델은 Members테이블과 연동되고
//그러고 나면 이 Member모델을 통해서 원하는 작업을 할 수 있게 된다.
const Member = require("./member")(sequelize, Sequelize.DataTypes);

//일단 DB라는 객체를 만들고 그 안에 Member 모델을 넣어서 공개한다.
//이렇게 하는 이유는 나중에 또 다른 테이블이 생긴다면 또 새로운 모델이 필요할 수 도 있기 때문

const db = {};
db.Member = Member;

module.exports = db;
