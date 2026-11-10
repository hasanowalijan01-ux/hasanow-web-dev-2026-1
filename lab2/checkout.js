import {
    cart,
    loadCart,
    saveCart,
    getTotalPrice,
    isValidCombo,
} from "./cart.js";
import { showNotification } from "./notification.js";

const categoryLabels = {
    soup: "Суп",
    main: "Главное блюдо",
    salad: "Салат/стартер",
    drink: "Напиток",
    dessert: "Десерт",
};

// 1. Отрисовка карточек
function renderCartItems() {
    const container = document.getElementById("cart-container");
    const emptyMsg = document.getElementById("empty-message");
    container.innerHTML = "";

    const items = Object.values(cart).filter((dish) => dish !== null);

    if (items.length === 0) {
        container.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    container.style.display = "grid";
    emptyMsg.style.display = "none";

    items.forEach((dish) => {
        const card = document.createElement("div");
        card.className = "dish-card";
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price} ₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="remove-btn">Удалить</button>
        `;
        
        card.querySelector(".remove-btn").addEventListener("click", () => {
            cart[dish.category] = null;
            saveCart();
            renderCartItems();
            
            // Вызов функции обновления итогов
            // eslint-disable-next-line no-use-before-define
            updateSummary();
        });

        container.appendChild(card);
    });
}

// 2. Обновление списка в форме
function updateSummary() {
    const summaryList = document.getElementById("order-summary-list");
    summaryList.innerHTML = "";
    
    Object.keys(categoryLabels).forEach((cat) => {
        const dish = cart[cat];
        const label = categoryLabels[cat];
        
        let text = `${label}: Не выбран`;
        if (dish) {
            text = `${label}: ${dish.name} (${dish.price} ₽)`;
        }
        
        const p = document.createElement("p");
        p.textContent = text;
        summaryList.appendChild(p);
    });

    document.getElementById("checkout-total").textContent = getTotalPrice();
}

// 3. Инициализация страницы
async function initCheckout() {
    loadCart(); // Получаем корзину из localStorage

    try {
        const response = await fetch("dishes.json");
        const allDishes = await response.json();
        
        // Восстанавливаем полные объекты блюд (добавляем картинки)
        Object.keys(cart).forEach((cat) => {
            if (cart[cat]) {
                const fullDish = allDishes.find(
                    (d) => d.keyword === cart[cat].keyword
                );
                if (fullDish) {
                    cart[cat] = fullDish;
                }
            }
        });
    } catch (error) {
        console.error("Ошибка загрузки картинок", error);
    }

    renderCartItems();
    updateSummary();
}

// 4. Отправка формы
const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isValidCombo()) {
        showNotification("Набор блюд не соответствует ни одному варианту.");
        return;
    }

    const form = e.target;
    const formData = new FormData(form);

    // Собираем данные заказа
    const deliveryType = formData.get("delivery_type");
    const deliveryTime = deliveryType === "by_time" 
        ? formData.get("delivery_time") 
        : null;

    const newOrder = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        delivery_address: formData.get("delivery_address"),
        delivery_type: deliveryType,
        delivery_time: deliveryTime,
        comment: formData.get("comment") || "",
        dishes: {
            soup: cart.soup,
            main: cart.main,
            salad: cart.salad,
            drink: cart.drink,
            dessert: cart.dessert,
        },
        total_price: getTotalPrice()
    };

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    // Имитация отправки на сервер (сохранение в localStorage)
    try {
        // Эмуляция задержки сети (чтобы было видно "Отправка...")
        await new Promise((resolve) => setTimeout(resolve, 800)); 

        // Получаем существующие заказы или создаем пустой массив
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        
        // Проверка лимита (не более 10 заказов по условию API)
        if (existingOrders.length >= 10) {
            throw new Error("Достигнут лимит заказов (максимум 10).");
        }

        // Добавляем новый заказ и сохраняем
        existingOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        // Очищаем корзину
        localStorage.removeItem("foodCart");
        
        alert("Заказ успешно оформлен!");
        window.location.href = "orders.html";

    } catch (error) {
        alert("Ошибка: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заказ";
    }
});

// Запуск при загрузке страницы
initCheckout();