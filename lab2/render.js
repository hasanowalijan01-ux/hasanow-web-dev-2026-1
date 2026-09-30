import { dishes } from "./data.js";
import { initCart } from "./cart.js";

const categoryOrder = ["soup", "main", "drink"];

export function renderDishes() {
    categoryOrder.forEach((category) => {
        const container = document.querySelector(
            `section[data-category="${category}"] .dishes-grid`
        );
        if (!container) return;

        const filtered = dishes
            .filter((dish) => dish.category === category)
            .sort((a, b) => a.name.localeCompare(b.name, "ru"));

        filtered.forEach((dish) => {
            const card = document.createElement("li");
            card.className = "dish-card";
            card.dataset.dish = dish.keyword;

            const img = document.createElement("img");
            img.src = dish.image;
            img.alt = dish.name;

            const price = document.createElement("p");
            price.className = "price";
            price.textContent = `${dish.price} ₽`;

            const name = document.createElement("p");
            name.className = "name";
            name.textContent = dish.name;

            const weight = document.createElement("p");
            weight.className = "weight";
            weight.textContent = dish.count;

            const button = document.createElement("button");
            button.textContent = "Добавить";

            card.append(img, price, name, weight, button);
            container.appendChild(card);
        });
    });
}

renderDishes();
initCart();