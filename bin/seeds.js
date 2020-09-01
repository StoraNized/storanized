require("../config/db.config");

const User = require("../models/user.model");
const Address = require("../models/address.model");
const Storage = require("../models/storage.model");
const Box = require("../models/box.model");
const Product = require("../models/product.model");

const productType = ['Motos', 'Motor y Accesorios', 'Moda y Accesorios', 'TV, Audio y Foto', 'Móviles y Telefonía', 'Informática y Electrónica', 'Deporte y Ocio', 'Bicicletas', 'Consolas y Videojuegos', 'Hogar y Jardín', 'Electrodomésticos', 'Cine, Libros y Música', 'Niños y Bebés', 'Coleccionismo', 'Materiales de construcción', 'Industria y Agricultura', 'Otros'] 

const getRanElem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
} 

const faker = require("faker");

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

function createUser() {
  const user = new User({
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: 12345678,
    phoneNumber: faker.phone.phoneNumber(),
    avatar: faker.image.avatar(),
    activation: {
      active: true,
      token: generateRandomToken()
    },
    role: 'client',
    terms: true,
    createdAt: faker.date.past()
  })

  return user.save()
}

function createAddress(userId) {
  const address = new Address({
    name: faker.name.title(),
    address: faker.address.streetAddress,
    city: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
    postalCode: faker.address.zipCode(),
    phone: faker.phone.phoneNumber(),
    longitude: faker.address.longitude(),
    latitude: faker.address.latitude(),
    defaultAddress: true,
    user: userId
  })
  return address.save()
}

function createStorage(userId, addressId) {
  const storage = new Storage({
    name: faker.name.title(),
    user: userId,
    address: addressId
  })
  return storage.save()
}
function createBox(userId, storageId) {
  const box = new Box({
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    location: faker.lorem.words(4),
    qrCode: faker.internet.url(),
    user: userId,
    storage: storageId
  })
  return box.save()
}
function createProduct(userId, boxId) {
  const product = new Product({
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    tags: [faker.lorem.word()],
    category: getRanElem(productType),
    price: '',
    isPublic: false,
    isSold: false,
    user: userId,
    box: boxId
  })
  return product.save()
}

const users = []

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Address.deleteMany({}),
    Storage.deleteMany({}),
    Box.deleteMany({}),
    Product.deleteMany({})
  ])
}
function seeds() {
  restoreDatabase()
    .then(() => {
      console.log('Database restored!')

      for (let i = 0; i < 4; i++) {
        createUser()
          .then(user => {
            console.log(user.email)
            
            users.push(user)
            createAddress(user.id)
              .then(address => {
                console.log('address', address.name)
                  for (let i = 0; i < 2; i++) {
                    createStorage(user.id, address.id)
                    .then(storage => {
                      console.log('storage', storage.name)
                      for (let i = 0; i < 4; i++) {
                        createBox(user.id, storage.id)
                        .then(box => {
                          console.log('box', box.location);
                          for (let i = 0; i < 20; i++) {
                            createProduct(user.id, box.id)
                              .then(product => {
                                console.log('product', product.name);
                                
                              })
                              .catch()
                          }
                          })
                          .catch()
                      }
                    })
                    .catch()
                  }
                })
              .catch()
        })
      }
    })
    .catch()
}

seeds()