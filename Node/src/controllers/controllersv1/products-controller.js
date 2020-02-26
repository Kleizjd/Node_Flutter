const Products = require('../../mongo/models/products');

const createProduct = async (request, response) => {
  try {
    const { title, description, price, images, userId } = request.body;

    const product = await Products.create({
      title,
      description,
      price,
      images,
      user: userId
    });
    response.send({ status: 'OK', data: 'product' });
  } catch (error) {
    console.log('create Product error: ', error);
    response.status(500).send({ status: 'Error', data: error.message });
  }
};
const deleteProduct = (request, response) => {};

const getProduct = async (request, response) => {
  try {
    const products = await Products.find({
      price: { $gt:10 } 
    })
      .populate('user', 'username email data role') //campos de la tabla usuario que se quieren devolver
      .select('title description price');
    response.send({ status: 'OK', data: products });
  } catch (error) {
    console.log('get Product error: ', error);
    response.status(500).send({ status: 'Error', data: error.message });
  }
};
const getProductByUser = async (request, response) => {
  try {
    const products = await Products.find({
      user: request.params.userId
    }).select('title description price');
    response.send({ status: 'OK', data: products });
  } catch (error) {
    console.log('get Product error: ', error);
    response.status(500).send({ status: 'Error', data: error.message });
  }
};

module.exports = { createProduct, deleteProduct, getProduct, getProductByUser };
