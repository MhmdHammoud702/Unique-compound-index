# Express booking concurrency exercise

This sample demonstrates that two simultaneous requests cannot book the same
room for the same time slot. MongoDB's unique compound index is the
concurrency guard; an application-level "check then insert" would still allow
a race.

## Requirements and setup

- Node.js 18 or newer (the demo uses the built-in `fetch` API)
- MongoDB running locally or another MongoDB URI

1. Run `npm install`.
2. Start MongoDB.
3. Run `npm start`.

MongoDB defaults to `mongodb://127.0.0.1:27017`. Set `MONGODB_URI` in `.env` to
use another server. The demo creates a fresh database named
`booking_demo_<run timestamp>` for each run.

## Expected result

`npm start` runs `src/server.js`. It connects to MongoDB, creates the index,
and starts the API. The cron schedule runs every second. On its first tick, the
job sends two booking requests together with different users but the same Room
101 and 11:00 AM booking date. One gets HTTP 201; the other gets HTTP 409 with
error code `E11000`. The demo checks that MongoDB contains one Room 101 booking
at 11:00 AM.

The demo always uses October 15, 2026 UTC. The collection has a unique compound
index for `{ roomId, bookingDate }`. Mongoose's `createdAt` and `updatedAt` are
audit timestamps and are not part of the constraint.

The server listens on port 3000 by default; set `PORT` to change it. The API
must be running because the cron job sends its two requests to the API.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create a booking |

Example request:

```json
{
  "roomId": "room-101",
  "userId": "user-one",
  "bookingDate": "2026-10-15T11:00:00.000Z"
}
```

`roomId`, `userId`, and `bookingDate` are required. A duplicate room/date
returns HTTP 409 with code `E11000`.

## Project structure

- `src/routes/` - Maps HTTP paths and methods to controller functions.
- `src/controllers/` - Calls services and sends HTTP responses.
- `src/services/` - Performs booking operations and translates database errors.
- `src/models/` - Declares the unique `{ roomId, bookingDate }` compound index.
- `src/jobs/` - Starts both booking requests together using a cron task.
- `src/config/` - MongoDB connection helper.
- `src/server.js` - Configures Express, starts MongoDB, and runs the concurrency demonstration.
