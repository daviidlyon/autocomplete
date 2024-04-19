# React Autocomplete Component

This React+Vite application is built to implement an autocomplete component that has the following features:

- Is universal, can trigger api calls in a debounced fashion (e.g for search engines)
- Can be interacted by with the keyboard, listens for ArrowUp, ArrowDown, Enter and Escape keys to do basic interaction
- Is built for performance. By using a combination of modern techniques, it saves resources and is speedy while providing a satisfactory user experience
- This example implementation uses the [TMDB API](https://www.themoviedb.org/) to enable movie searching
- Highlights keyword matches in the suggestions

## See the app working

You can visit https://autocomplete-movie-searcher.netlify.app/ to see the app running live!

## Run the application in development mode

To run the application in development mode you should do the following:

1. Navigate to the project root folder
2. Run `yarn install` (if you don't have yarn already, run `npm i -g yarn`)
3. Run `yarn dev` in order to run the development server

## Run the dockerized application

To run this application from docker you should

1. Get [Docker](https://docs.docker.com/get-docker/)
2. Build the image by running:

```
docker build . -t "autocomplete"
```

4. After Docker is done building the image, you should be able to see it by running:

```
docker images
```

1. If you succesfully run these commands and are able to see the docker image, start the app with:

```
docker run -p 8080:8080 sample-project:v1.0
```

## Notes

- .env should not be commited with sensitive information, this is done just for demo purposes
- Some upgrades can be done for this component, by making it as agnostic as possible we can use it for multiple types of use cases
- Last selected is typically used in search engines, however, this is not a general use-case for an autocomplete component, this is an enhancement that can be done if the requirements are specified
- We can do testing, this will require some time and using external libraries such as RTL and jest