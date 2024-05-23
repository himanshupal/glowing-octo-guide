# Fluxcart API

## Steps to get the project working locally

- Clone the repo
- Install node dependencies (yarn preferred) using
  ```sh
  yarn or npm install
  ```
- Generate [Prisma](https://prisma.io) models using
  ```sh
  yarn prisma generate
  ```
- Currently [sqlite](https://sqlite.org) is being used with some existing data, but in case connecting with some other & need some sample data, DB can be seeded using below command
  ```sh
  yarn seed
  ```
- Run the server using `yarn dev` for development or `yarn start` for deployment purpose

---

> Service is live at https://glowing-octo-guide.onrender.com
