# MySMS Messenger

A full-stack SMS messaging application built with Ruby on Rails and Angular.

## Prerequisites

- Ruby 3.3.0
- Node.js 18+
- MongoDB
- Twilio Account (for SMS functionality)
- Foreman (`gem install foreman`)

## Setup

1. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   bundle install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend/mysms-messenger
   npm install
   ```

4. Start MongoDB:
   ```bash
   mongod
   ```

5. Seed the database with Simpson's characters:
   ```bash
   cd backend
   rails db:seed
   ```

## Running the Application

The application uses Foreman to run both the backend and frontend servers together. From the root directory:

```bash
foreman start -f Procfile
```

This will start:
- Backend server on http://localhost:3000
- Frontend server on http://localhost:4200

## Using the Application

1. Open http://localhost:4200 in your browser
2. Sign in using one of the seeded accounts (check the console output from `rails db:seed` for login credentials)
3. Start sending SMS messages!

## Seeded Users

The application comes pre-seeded with Simpson's characters. When you run `rails db:seed`, you'll see output like:

```
User created: Homer Simpson
Login with:
  Email: homer@simpsons.com
  Password: 123456
----------------------------------------
```

Use any of these credentials to log in to the application.

## API Endpoints

- `POST /api/v1/auth/sign_in` - Sign in
- `POST /api/v1/auth` - Sign up
- `GET /api/v1/messages` - Get messages
- `POST /api/v1/messages` - Send a message
- `PATCH /api/v1/messages/:id/update_status` - Update message status

## Development

- Backend: Ruby on Rails 7.1.5.1
- Frontend: Angular 17
- Database: MongoDB
- Authentication: Devise Token Auth
- SMS Service: Twilio
- Process Management: Foreman
