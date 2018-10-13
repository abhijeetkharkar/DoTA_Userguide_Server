const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const test = `http://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1/?key=0D0867742E56E8CA06B6F3B14F416D44&language=en_us&format=JSON`;
const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/dota", (req, res) => {
  const param = req.query.q;
  const identifier = req.query.id

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  if(param === "items_recipe") {
    fetch(test).then(function (response) {
      return response.json();
    }).then(function(stats){
      const recipes = stats.result.items.filter(function(item) {
          return item.recipe === 1;
      }).map(function(item) { return item; });
      console.log("Recipes = ",recipes.length);
      res.json(recipes);
    }).catch(function(error){
      console.log('Request failed due to ', error)
    });
  }


  if(param === "match_from_matchID") {

    fetch("https://api.opendota.com/api/matches/"+identifier).then(function (response) {
      return response.json();
    }).then(function(stats){
      //console.log("SERVER, match_from_matchID, Match = ",stats);
      res.json(stats);
    }).catch(function(error){
      console.log('Request failed due to ', error)
    });
  }

  if(param === "items_others") {
    fetch(test).then(function (response) {
      return response.json();
    }).then(function(stats){
      const others = stats.result.items.filter(function(item) {
          return item.recipe === 0;
      }).map(function(item) { return item; });
      console.log("Others = ",others.length);
      res.json(others);
    }).catch(function(error){
      console.log('Request failed due to ', error)
    });
  }

  if(param === "player_from_playerID") {
    fetch("https://api.opendota.com/api/players/"+identifier).then(function (response) {
      return response.json();
    }).then(function(stats){
      //console.log("SERVER, player_from_playerID, Player = ",stats);
      res.json(stats);
    }).catch(function(error){
      console.log('Request failed due to ', error)
    });
  }

});


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
