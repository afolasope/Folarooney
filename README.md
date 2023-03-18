# Folarooney

A restaurant chat bot

## Requirements

- Node js
- Yarn
- MongoDB
- Paystack business (go to [Paystack](https://dashboard.paystack.com) to create one).

## How to run

1. Run `yarn` to install app dependencies.
1. Run `yarn prep` to install frontend and backend dependencies.
1. Rename `/backend/.env.sample` to `/backend/.env`.
1. Update `/backend/.env` file with your database credentials.
1. Rename `/frontend/.env.sample` to `/frontend/.env`.
1. Replace VITE_PAYSTACK_PUBLIC_KEY with your paystack public key.
1. Run `yarn food` to add food to the database.
1. Run `yarn build`.
1. Run `yarn start`.
