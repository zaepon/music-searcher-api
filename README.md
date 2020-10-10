# music-searcher-api
Backend for Frontend Music Searcher found at henril.com

# Prerequisite
  -node
  -postgresql server

# Development 

install
```
yarn
```

For fast reloading during development: Open 2 terminals

1st terminal:
```
yarn watch
```
2nd: terminal:
```
yarn 
```


# Project Structure
```

|-- .
    |-- .gitignore
    |-- README.md
    |-- package.json
    |-- tsconfig.json
    |-- yarn.lock
    |-- dist
    |   |-- index.js
    |   |-- index.js.map
    |   |-- database
    |   |   |-- index.js
    |   |   |-- index.js.map
    |   |-- resolvers
    |       |-- index.js
    |       |-- index.js.map
    |       |-- test.js
    |       |-- test.js.map
    |-- src
        |-- index.ts
        |-- database
        |   |-- index.ts
        |   |-- entities
        |       |-- .gitkeep
        |-- resolvers
            |-- index.ts
            |-- test.ts
            |-- types
                |-- .gitkeep
  ```




