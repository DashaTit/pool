// 🗄️ Простой фейковый API
class Api {
    constructor() {
        this.storageKey = 'campus_orders';
    }

    // Инициализация начальных данных
    initialize() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = [];
            this.save(initialData);
        }
    }

    // Сохранить данные
    save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Получить данные
    get() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Имитация задержки сети
    delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Генератор ID
    generateId() {
        return Date.now();
    }

    // GET /api/orders - получить все заказы
    async getOrders() {
        await this.delay();
        return this.get();
    }

    // POST /api/orders - создать заказ
    async createOrder(orderData) {
        await this.delay();
        const orders = this.get();

        const newOrder = {
            id: this.generateId(),
            items: orderData.items,
            address: orderData.address,
            status: 'новый',
            createdAt: new Date().toISOString()
        };

        orders.unshift(newOrder);
        this.save(orders);
        return newOrder;
    }
}

// 🎯 Создаем экземпляр API
const api = new Api();
api.initialize();

// 🎭 Функции для работы с API (имитируем fetch)
async function apiRequest(url, options = {}) {
    await api.delay(200);

    if (url === '/api/orders') {
        if (options.method === 'GET') {
            const orders = await api.getOrders();
            return {
                ok: true,
                json: async () => orders
            };
        }

        if (options.method === 'POST') {
            const data = JSON.parse(options.body);
            const newOrder = await api.createOrder(data);
            return {
                ok: true,
                status: 201,
                json: async () => newOrder
            };
        }
    }

    return {
        ok: false,
        status: 404,
        json: async () => ({error: 'Not found'})
    };
}