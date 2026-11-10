import { deleteOrder, updateOrder } from "./api.js";

let orders = [];

const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");

// 1. Закрытие модального окна
function closeModal() {
    modalOverlay.style.display = "none";
}

// 2. Отрисовка списка заказов
function renderOrders() {
    const container = document.getElementById("orders-list");
    const noOrdersMsg = document.getElementById("no-orders");

    container.innerHTML = "";

    if (orders.length === 0) {
        noOrdersMsg.style.display = "block";
        return;
    }

    noOrdersMsg.style.display = "none";

    orders.forEach((order, index) => {
        const dishNames = Object.values(order.dishes)
            .filter((dish) => dish !== null)
            .map((dish) => dish.name)
            .join(", ");

        const date = new Date(order.created_at).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        let deliveryTime = "Как можно скорее (с 7:00 до 23:00)";
        if (order.delivery_type === "by_time" && order.delivery_time) {
            deliveryTime = `Ко времени: ${order.delivery_time}`;
        }

        const orderCard = document.createElement("div");
        orderCard.className = "order-card";
        orderCard.innerHTML = `
            <div class="order-info">
                <p><strong>Заказ №${index + 1}</strong> от ${date}</p>
                <p class="order-dishes">${dishNames}</p>
                <p>Стоимость: <strong>${order.total_price} ₽</strong></p>
                <p>Доставка: ${deliveryTime}</p>
            </div>
            <div class="order-actions">
                <button class="btn-view" data-id="${order.id}">
                    Подробнее
                </button>
                <button class="btn-edit" data-id="${order.id}">
                    Редактировать
                </button>
                <button class="btn-delete" data-id="${order.id}">
                    Удалить
                </button>
            </div>
        `;
        container.appendChild(orderCard);
    });

    // eslint-disable-next-line no-use-before-define
    attachEventListeners();
}

// 3. Обработчики кнопок списка
function attachEventListeners() {
    const viewBtns = document.querySelectorAll(".btn-view");
    const editBtns = document.querySelectorAll(".btn-edit");
    const deleteBtns = document.querySelectorAll(".btn-delete");

    viewBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // eslint-disable-next-line no-use-before-define
            openViewModal(btn.dataset.id);
        });
    });
    
    editBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // eslint-disable-next-line no-use-before-define
            openEditModal(btn.dataset.id);
        });
    });
    
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // eslint-disable-next-line no-use-before-define
            openDeleteModal(btn.dataset.id);
        });
    });
}

// 4. Модальное окно: Просмотр
function openViewModal(id) {
    const order = orders.find((o) => o.id == id);
    if (!order) return;

    const dishesHtml = Object.values(order.dishes)
        .filter((d) => d !== null)
        .map((d) => `<p>${d.name} — ${d.price} ₽</p>`)
        .join("");

    const orderDate = new Date(order.created_at).toLocaleString("ru-RU");

    modalContent.innerHTML = `
        <button class="close-btn" id="modal-close">✕</button>
        <h2>Заказ №${orders.indexOf(order) + 1}</h2>
        <p><strong>Дата:</strong> ${orderDate}</p>
        <p><strong>Имя:</strong> ${order.full_name}</p>
        <p><strong>Телефон:</strong> ${order.phone}</p>
        <p><strong>Адрес:</strong> ${order.delivery_address}</p>
        <div class="modal-dishes">${dishesHtml}</div>
        <p><strong>Итого:</strong> ${order.total_price} ₽</p>
        <div class="modal-actions">
            <button class="btn-primary" id="modal-ok">Ок</button>
        </div>
    `;
    
    modalOverlay.style.display = "flex";

    document.getElementById("modal-close")
        .addEventListener("click", closeModal);
    document.getElementById("modal-ok")
        .addEventListener("click", closeModal);
}

// 5. Модальное окно: Редактирование
function openEditModal(id) {
    const order = orders.find((o) => o.id == id);
    if (!order) return;

    const isTimeSelected = order.delivery_type === "by_time" ? "checked" : "";
    const isNowSelected = order.delivery_type === "now" ? "checked" : "";

    modalContent.innerHTML = `
        <button class="close-btn" id="modal-close">✕</button>
        <h2>Редактирование заказа</h2>
        <form id="edit-form">
            <label>Имя: 
                <input type="text" name="full_name" 
                       value="${order.full_name}" required>
            </label>
            <label>Email: 
                <input type="email" name="email" 
                       value="${order.email}" required>
            </label>
            <label>Телефон: 
                <input type="tel" name="phone" 
                       value="${order.phone}" required>
            </label>
            <label>Адрес: 
                <input type="text" name="delivery_address" 
                       value="${order.delivery_address}" required>
            </label>

            <div class="radio-group" style="margin: 10px 0;">
                <label style="display:inline-block; margin-right: 15px; 
                              font-weight: normal;">
                    <input type="radio" name="delivery_type" 
                           value="now" ${isNowSelected}> 
                    Как можно скорее
                </label>
                <label style="display:inline-block; font-weight: normal;">
                    <input type="radio" name="delivery_type" 
                           value="by_time" ${isTimeSelected}> 
                    Ко времени
                </label>
            </div>

            <label>Время доставки: 
                <input type="time" name="delivery_time" 
                       min="07:00" max="23:00" 
                       value="${order.delivery_time || ''}">
            </label>

            <label>Комментарий: 
                <textarea name="comment">${order.comment}</textarea>
            </label>
            <div class="modal-actions">
                <button type="submit" class="btn-primary">
                    Сохранить
                </button>
                <button type="button" class="btn-secondary" 
                        id="modal-cancel">
                    Отмена
                </button>
            </div>
        </form>
    `;

    modalOverlay.style.display = "flex";

    const closeBtn = document.getElementById("modal-close");
    const cancelBtn = document.getElementById("modal-cancel");

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    const form = document.getElementById("edit-form");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Собираем обновленные данные
        const updatedData = {
            full_name: formData.get("full_name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            delivery_address: formData.get("delivery_address"),
            delivery_type: formData.get("delivery_type"),
            delivery_time: formData.get("delivery_type") === "by_time" 
                ? formData.get("delivery_time") 
                : null,
            comment: formData.get("comment")
        };

        try {
            // Вызываем функцию обновления (из api.js)
            await updateOrder(id, updatedData);

            closeModal();
            alert("Заказ успешно изменён!");
            
            // eslint-disable-next-line no-use-before-define
            initOrders(); 
        } catch (error) {
            alert("Ошибка при обновлении: " + error.message);
        }
    });
}

// 6. Модальное окно: Удаление
function openDeleteModal(id) {
    modalContent.innerHTML = `
        <button class="close-btn" id="modal-close">✕</button>
        <h2>Удаление заказа</h2>
        <p>Вы уверены, что хотите удалить этот заказ?</p>
        <div class="modal-actions">
            <button id="confirm-delete" class="btn-danger">
                Да
            </button>
            <button type="button" class="btn-secondary" 
                    id="modal-cancel">
                Отмена
            </button>
        </div>
    `;

    modalOverlay.style.display = "flex";

    document.getElementById("modal-close")
        .addEventListener("click", closeModal);
    document.getElementById("modal-cancel")
        .addEventListener("click", closeModal);

    document.getElementById("confirm-delete")
        .addEventListener("click", async () => {
            try {
                // Вызываем функцию удаления (из api.js)
                await deleteOrder(id);

                closeModal();
                alert("Заказ успешно удалён!");
                
                // eslint-disable-next-line no-use-before-define
                initOrders(); 
            } catch (error) {
                alert("Ошибка при удалении: " + error.message);
            }
        });
}

// 7. Инициализация страницы
function initOrders() {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    
    orders = savedOrders.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });

    renderOrders();
}

// Запуск
initOrders();