Gogobot node.js build radiator for TeamCity

# Setup

 * Edit config.json and add your list of buildTypeId -> name mappings that you want to be displayed in the radiator
 * Add two environment variables for the TeamCity API authentication: RADIATOR_TEAMCITY_USERNAME and RADIATOR_TEAMCITY_PASSWORD
 * You're all set!

```
npm install
node app.js
```

Enjoy!