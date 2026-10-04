import { dishes } from "./data.js";
import { initCart } from "./cart.js";
import { initFilters } from "./filter.js";

const categories = ["soup", "main", "salad", "drink", "dessert"];

export function renderDishes() {
    categories.forEach((category) => {
        const container = document.querySelector(
            `section[data-category="${category}"] .dishes-grid`
        );
        if (!container) return;

        container.innerHTML = "";

        const filtered = dishes
            .filter((dish) => dish.category === category)
            .sort((a, b) => a.name.localeCompare(b.name, "ru"));

        filtered.forEach((dish) => {
            const card = document.createElement("li");
            card.className = "dish-card";
            card.dataset.dish = dish.keyword;
            card.dataset.kind = dish.kind;

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
initFilters();
initCart();