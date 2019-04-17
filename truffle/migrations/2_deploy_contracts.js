var League = artifacts.require("League");
var Team = artifacts.require("Team");
var Player = artifacts.require("Player");


module.exports = function(deployer) {
  deployer.deploy(Player);
  deployer.deploy(League);
  deployer.deploy(Team);
};