import { dishes } from "./data.js";

export const cart = {
    soup: null,
    main: null,
    drink: null,
};

const categoryLabels = {
    soup: "Суп",
    main: "Главное блюдо",
    drink: "Напиток",
};

function highlightCards() {
    document.querySelectorAll(".dish-card").forEach((card) => {
        const keyword = card.dataset.dish;
        const isSelected = Object.values(cart).some(
            (dish) => dish && dish.keyword === keyword
        );
        card.classList.toggle("selected", isSelected);
    });
}

function updateCartUI() {
    const orderBlock = document.querySelector(".order-block");
    const form = document.querySelector(".order-section form");

    const selected = [];
    let total = 0;
    let hasAny = false;

    Object.keys(cart).forEach((category) => {
        const dish = cart[category];
        const label = categoryLabels[category];

        if (dish) {
            total += dish.price;
            selected.push(`${label}: ${dish.name} — ${dish.price} ₽`);
            hasAny = true;
        } else {
            selected.push(`${label}: Блюдо не выбрано`);
        }
    });

    if (!hasAny) {
        orderBlock.innerHTML = `<h3>Ваш заказ</h3><p>Ничего не выбрано</p>`;
    } else {
        orderBlock.innerHTML = `
            <h3>Ваш заказ</h3>
            ${selected.map((line) => `<p>${line}</p>`).join("")}
            <p class="total">Стоимость заказа: ${total} ₽</p>
        `;
    }

    document.querySelectorAll(".hidden-input").forEach((el) => el.remove());

    Object.keys(cart).forEach((category) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = category;
        input.value = cart[category] ? cart[category].keyword : "";
        input.className = "hidden-input";
        form.appendChild(input);
    });
}

export function initCart() {
    document.querySelectorAll(".dish-card button").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".dish-card");
            const keyword = card.dataset.dish;
            const dish = dishes.find((d) => d.keyword === keyword);

            if (!dish) return;

            cart[dish.category] = dish;
            updateCartUI();
            highlightCards();
        });
    });
}