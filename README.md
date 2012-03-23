Gogobot node.js build radiator for TeamCity

# Setup

 * Edit config.json and add your list of buildTypeId -> name mappings that you want to be displayed in the radiator
 * Add the environment variables for the TeamCity API authentication: 
  
  ```
  RADIATOR_TEAMCITY_HOST=your.host.name
  RADIATOR_TEAMCITY_USERNAME=username
  RADIATOR_TEAMCITY_PASSWORD=p4ssw0rd
  ```
  
 * You're all set!

```
npm install
node app.js
```

Enjoy!