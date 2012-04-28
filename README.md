Gogobot node.js build radiator for TeamCity

# Install

Clone the repository and use npm to install the dependencies:
```
npm install
```

# Configure

 * Edit config.json and add your list of buildTypeId -> name mappings that you want to be displayed in the radiator
 * Edit package.json and set the TeamCity host, username and password for API authentication. There are other ways to provide this information (e.g. environment variables or the command line), see the [npm docs](http://npmjs.org/doc/config.html) for details.

# Run
```
npm start
```

Enjoy!