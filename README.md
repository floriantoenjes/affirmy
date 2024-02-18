# Affirmy App

An app to create affirmations or reminders for oneself with complex scheduling options,
offline storage and synchronization.

## Functionality

Users can...
* Register and sign in into the app.
* Create affirmations, edit, and delete affirmations.
* Schedule affirmations.
* Choose to schedule those affirmations daily or hourly.
* Choose on which days/hours and in what interval they should be reminded.
* Synchronize their affirmations list with the server, to access them from any device.

## Technical Details

The frontend...
* Is written in TypeScript using the Angular 11 framework and makes use of the Redux pattern by integrating
ngrx-store.
* Styling is done using Tailwind CSS and the Angular Material Library.
* Persists user data on the device using the PouchDb NoSQL database.
  
The backend...
* Has an authorization server written in .NET 5.0 using the Identity Framework.
* Uses a CouchDb server to synchronize the local PouchDb database with the offline storage on the device.
* I used this app's backend to apply DDD principles after I read the book Domain Driven Design by Eric Evans.

Deployment...
* Of the App is cross-platform, which is done by using the CapacitorJS wrapper, to make
  functions of the device, like local notifications available to the app.
* Of the backend is done on via Docker Compose.

