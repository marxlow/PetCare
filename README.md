## Installation

1. Git clone/pull the repository to your own local directory
2. Install npm packages using `npm install`
3. Make sure you have a `.env` file in the source directory, with just one line of code `NODE_PATH=src/`. This is a way for files to reference imports from the src directory.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Connect to Postgresql Database

Create a config.js file in the `src\api\` directory similar to the configExample.js and update the password and database field with your own password (for user postgres) and database name (Capitalized Specific).

## Docker

Make sure you have docker installed before continuing.

1. On your terminal go to the directory of PetCare.
2. Build the docker container using your current directory. This builds a docker container with the image name "petcare". Run:
```docker build -t petcare .```
3. Run the "petcare" docker container at port 3000. Run:
```docker run -p 3000:3000 petcare```
4. Go to localhost:3000 to see the app