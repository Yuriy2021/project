const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

/* const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

const $goodsList = document.querySelector('.goods-list');

const renderGoodsItem = ({ title, price }) => {
    return `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;
};

const renderGoodsList = (list = goods) => {
    let goodsList = list.map(
        (item) => {
            return renderGoodsItem(item)
        }
    ).join('');

    $goodsList.insertAdjacentHTML('beforeend', goodsList);
}

renderGoodsList(); */

class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><button class = "buy-btn">Добавить в корзину</button> <button class = "buy_btn__del" > Удалить из корзины </button></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
        this.filtred = [];
    }

    fetchGoods() {
        function send(url) {
            return new Promise(function (resolve, reject) {
                const xhr = new XMLHttpRequest()
                xhr.open('GET', url, true);
                xhr.onload = function () {
                    if (this.status == 200) {
                        resolve(this.response);
                    } else {
                        const error = new Error(this.statusText);
                        error.code = this.status;
                        reject(error);
                    }
                };
                xhr.onerror = function () {
                    reject(new Error("Network Error"));
                };
                xhr.send();
            })
        }
        send(`${API_URL}catalogData.json`)
            .then((request) => {
                this.goods = JSON.parse(request).map(good => ({ title: good.product_name, price: good.price }))
                this.render();
            })
            .catch((err) => {
                console.log(err.text)
            })
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    calculateGoodList() {
        let sum = 0
        this.goods.forEach(element => sum += element.price)
        return ("Сумма товаров = " + sum)
    }

}

const list = new GoodsList();
list.fetchGoods();
list.render();
list.calculateGoodList();

class Basketlist {
    constructor(container = '.basket_goods') {
        this.container = container;
        this.basketGoods = [];
        this.allBasketProducts = [];
        this.getBasket()
            .then((data) => {
                this.basketGoods = data;
                console.log(data);
            });
        this.deleteFromBasket();
        this.addToBasket();
    }
    //Вывод корзины временно в консоль вместо вывода на страницу корзины.
    getBasket() {
        return fetch(`${API_URL}getBasket.json`)
            .then((response) => response.json())

            .catch((err) => console.log(err));
    }
    deleteFromBasket() {
        fetch(`${API_URL}/deleteFromBasket.json`)
            .then((response) => { return response.json(); })
            .then((data) => {
                if (data.result == 1) {
                    const delBtn = document.querySelectorAll('.buy_btn__del');
                    delBtn.forEach(item => {
                        item.addEventListener('click', () => {
                            this.basketGoods.splice(item, 1)
                            console.log('Применение метода .removechild')
                        });
                    });
                } else {
                    return;
                }
            })
            .catch((err) => console.log(err));
    }

    addToBasket() {
        fetch(`${API_URL}/addToBasket.json`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (data.result == 1) {
                    const buyBtn = document.querySelectorAll('.buy-btn');
                    buyBtn.forEach(item => {
                        item.addEventListener('click', () => {
                            this.basketGoods.push(item);
                            // Временный вывод в консоль вместо добавления на страницу корзины.
                            console.log(data)
                        });
                    });

                } else {
                    return;
                }
            })
            .catch((err) => console.log(err));
    }
}

class BasketItem {
    constructor(product) {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;

    }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><button class = "buy_btn__del" > Удалить из корзины </button></div>`;

    }
}
const basketCatalog = new Basketlist();

