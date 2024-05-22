import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.contact
  .createMany({
    data: [
      {
        id: 1,
        phoneNumber: "8426003610",
        email: "carlydudley+unknown1@emoltra.com",
        linkPrecedence: "primary",
      },
      {
        id: 2,
        phoneNumber: "8535792927",
        email: "pecrecraditrou-4218@yopmail.com",
        linkedId: 4,
        linkPrecedence: "secondary",
      },
      {
        id: 3,
        phoneNumber: "9964482641",
        email: "yujeinneibrepei-6931@yopmail.com",
        linkPrecedence: "primary",
      },
      {
        id: 4,
        phoneNumber: "8695773815",
        email: "pecrecraditrou-4218@yopmail.com",
        linkPrecedence: "primary",
      },
      {
        id: 8,
        phoneNumber: "9964482641",
        email: "rauzaucrexitru-4686@yopmail.com",
        linkedId: 3,
        linkPrecedence: "secondary",
      },
      {
        id: 11,
        phoneNumber: "8025912214",
        email: "rauzaucrexitru-4686@yopmail.com",
        linkedId: 3,
        linkPrecedence: "secondary",
      },
      {
        id: 18,
        phoneNumber: "8426003610",
        email: "carlydudley@emoltra.com",
        linkedId: 1,
        linkPrecedence: "secondary",
      },
    ],
  })
  .then(() => {
    console.log("Seeding complete...");
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
  });
