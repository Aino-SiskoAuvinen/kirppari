# kirppari
Testit on tehty vain vaadituille poluille, vaikka APIsta joku muukin polku löytyy
Kuvia ei ole mahdollisuus lisätä 

Käytä seuraavia rakenteita post/put pyyntöihin:
POST user
{
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice.smith@gmail.com",
  "phoneNumber": "040-1231234",
  "location": "Linnanmaki",
  "username": "muumi",
  "password": "1234"
}
 POST item
 {
    "title": "titityy",
    "description": "pikkulintu",
    "price": "1000",
    "category": "lemmikit",
    "creationDay": "2022-02-24",
    "Shipping": false,
    "Pickup": true,
    "image1": "",
    "image2": "",
    "image3": "",
    "image4": ""
}
PUT item
{
    "title": "kvaakkvaak",
    "description": "isompi lintu",
    "price": "2000",
    "category": "lemmikit",
    "email": "tipin@posti.fi",
    "location": "Lintutorni",
    "Shipping": true,
    "Pickup": true,
    "image1": "",
    "image2": "",
    "image3": "",
    "image4": ""
}
