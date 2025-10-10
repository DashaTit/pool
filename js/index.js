// 🎯 Основные элементы
const orderForm = document.getElementById('orderForm');
const ordersContainer = document.getElementById('ordersContainer');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// 📦 Хранилище заказов
let orders = [];

// 🔄 Показать сообщение
function showMessage(element, text) {
    element.textContent = text;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 4000);
}

function showError(text) {
    showMessage(errorMessage, '❌ ' + text);
}

function showSuccess(text) {
    showMessage(successMessage, '✅ ' + text);
}

// 📥 Загрузить заказы
async function loadOrders() {
    try {
        const response = await apiRequest('/api/orders', { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        throw error;
    }
}

// 📤 Создать заказ
async function createOrder(orderData) {
    try {
        const response = await apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Ошибка создания заказа: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// 🎨 Отобразить заказы
function renderOrders(ordersArray) {
    if (!ordersArray || ordersArray.length === 0) {
        ordersContainer.innerHTML = '<div class="loading">Заказов пока нет</div>';
        return;
    }

    ordersContainer.innerHTML = ordersArray.map(order => `
        <div class="order-card">
            <h3>Заказ #${order.id}</h3>
            <p><strong>🍽️ Что:</strong> ${order.items}</p>
            <p><strong>📍 Куда доставить:</strong> ${order.address}</p>
        </div>
    `).join('');
}

// 🔄 Обновить список заказов
async function refreshOrders() {
    try {
        orders = await loadOrders();
        renderOrders(orders);
    } catch (error) {
        ordersContainer.innerHTML = '<div class="loading">Ошибка загрузки заказов</div>';
        showError('Не удалось загрузить заказы. Попробуйте позже.');
    }
}

// 📝 Обработчик формы
orderForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const formData = new FormData(this);
    const orderData = {
        items: formData.get('items').trim(),
        address: formData.get('address').trim()
    };

    // Блокируем кнопку
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Создаём...';
    button.disabled = true;

    try {
        // Создаем заказ
        const newOrder = await createOrder(orderData);
        // Очищаем форму
        this.reset();
        // Обновляем список
        await refreshOrders();
        showSuccess('Заказ успешно создан!');
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        showError('Не удалось создать заказ. Проверьте данные и попробуйте снова.');
    } finally {
        // Разблокируем кнопку
        button.textContent = originalText;
        button.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    refreshOrders();
});