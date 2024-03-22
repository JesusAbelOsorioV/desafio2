const { log } = require('console');
const fs = require('fs');
const path = require('path');
//instanciando la clase
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = this.products;
    }
    /**
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {string} thumbnail 
     * @param {string} code 
     * @param {number} stock 
     */
    //agregar un producto
    async addProduct(data) {
        const { title, description, price, thumbnail, code, stock } = data;
        //verificar que todos los campos sean obligatorios  
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son requeridos')
            return;
        }
        const products = await getJson(this.path);
        const newProduct = {
            id: products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }
        //verificar que el code sea unico y no se repita
        if (products.find((productManager) => productManager.code === code)) {
            console.log(`ya existe un producto con el code: ${code}`);
            return;
        }
        products.push(newProduct);
        return saveJson(this.path, products);
    }
       //Obtener productos para mostrar todos los productos agreados, o si el array esta vacio
    getProducts() {
        return getJson(this.path);
    }
    // obtener productos por Id y verificar que existe y no se repita
    async getProductsById(id) {
        const products = await getJson(this.path)
        const product = products.find((p) => p.id === parseInt(id));
        if (!product) {
            console.log('Not found', `el id: ${id}`);
            return;
        }
        console.log(`Product con id: ${id}`, product);
    }
    async updateProducts(id, updateProducts){
        const products = await getJson(this.path)
        const updateP = products.findIndex( product => product.id === id);
        if (updateP !== -1){
            products[updateP] = { ...products[updateP], ...updateProducts };
            await saveJson(this.path, products);
            console.log('Producto actualizado');
            return products[updateP];
    }
    console.log(`Product con id: ${id} no encontrado`);
}
    async deleteProduct(id){
        const products = await getJson(this.path)
        const product = products.findIndex( product => product.id === id);
        if (product !== -1){
            products.splice(product, 1);
            await saveJson(this.path, products);
            console.log('Producto eliminado');
        }else{
          console.log(`No exixte ningun producto con el id: ${id}`);  
        }
        
    }
}
    
//verificamos que el archivo exista, si no existe se muestra un objeto vacio
//si exixte el archivo lo leemos
const getJson = async (path) => {
    if (!fs.existsSync(path)) {
        return [];
    }
    const content = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(content);
}
//escribimos en el archivo creado
const saveJson = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.promises.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no se modifico`)
    }
};

async function test() {
    const productmanager = new ProductManager('./Products.json')

    await productmanager.addProduct({
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'sin imagen',
        code: 'asd123',
        stock: 25,
    });
    await productmanager.addProduct({
        title: 'producto prueba2',
        description: 'Este es un producto prueba2',
        price: 352,
        thumbnail: 'sin imagen',
        code: 'asd124',
        stock: 15,
    });
    const datos = await productmanager.getProducts(this.path);
    await productmanager.getProductsById(2);
    console.log('Productos: ', datos)

    await productmanager.updateProducts((1),{
        title: 'producto prueba45',
        description: 'Este es un producto prueba44',
        price: 2000,
        thumbnail: 'sin imagen',
        code: 'asd123',
        stock: 2,
    });
    const datos1 = await productmanager.getProducts(this.path);
    console.log('Productos: ', datos1)
    await productmanager.deleteProduct(1);
    await productmanager.deleteProduct(2);
    const datos3 = await productmanager.getProducts(this.path);
    console.log('Productos:', datos3);
} 
test()