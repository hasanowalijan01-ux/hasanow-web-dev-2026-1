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
const form = document.getElementById("checkout-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isValidCombo()) {
        showNotification("Набор блюд не соответствует ни одному варианту.");
        return;
    }

    const form = e.target;
    const formData = new FormData(form);

    const orderData = {
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        subscribe: formData.get("subscribe") ? 1 : 0,
        phone: formData.get("phone"),
        delivery_address: formData.get("delivery_address"),
        delivery_type: formData.get("delivery_type"),
        comment: formData.get("comment") || "",
    };

    if (orderData.delivery_type === "by_time") {
        orderData.delivery_time = formData.get("delivery_time");
    }

    if (cart.soup) orderData.soup_id = cart.soup.keyword;
    if (cart.main) orderData.main_course_id = cart.main.keyword;
    if (cart.salad) orderData.salad_id = cart.salad.keyword;
    if (cart.drink) orderData.drink_id = cart.drink.keyword;
    if (cart.dessert) orderData.dessert_id = cart.dessert.keyword;

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    try {
        const response = await fetch("https://httpbin.org/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error("Ошибка сервера");
        }

        alert("Заказ успешно оформлен!");
        localStorage.removeItem("foodCart");
        window.location.href = "index.html"; 

    } catch (error) {
        alert("Не удалось оформить заказ. Проверьте соединение.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заказ";
    }
});

// Запуск при загрузке страницы
initCheckout();