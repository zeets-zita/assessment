## Setup:
Ensure Node.js 18.13.0 or later is installed.

#### You can check your Node.js version by running:
node -v

If you need to update, download it from nodejs.org or use a version manager like nvm.

#### Install dependencies:

npm install

#### Run the Angular project:
ng serve


## Design decisions:

* Added a side navigation to reduce dead space on the page.
* Kept date and temperature static instead of using an API to fetch real-time data. In a real-world setting, I would use an API to get the current temperature based on the user's location, but I avoided additional API calls to keep the code simple.
* Added a summary section for the charts so users can quickly access key data without viewing the full charts.
* Extended the water consumption chart by one month to make the bar chart more interactive.
* Used a dropdown instead of a date picker for water consumption selection. While a date picker would have been ideal, I wanted to avoid adding too much data to the JSON file.
* Applied muted colours across the charts and page to ensure seamless blending between light and dark modes without requiring additional colour adjustments.

## Key Features:

* Notification with sound effect and red alert flash to grab the user's attention.
  * Note: In Chrome, the notification sound might not play automatically due to browser restrictions requiring user interaction.
* Summary section with key data and navigation buttons for easy access.
* Smooth transition between light and dark mode.
* Collapsible sidebar for better responsiveness on smaller screens.

# Assessment 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
