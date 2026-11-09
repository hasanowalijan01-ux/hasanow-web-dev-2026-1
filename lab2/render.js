import { initCart, loadCart } from "./cart.js";
import { initFilters } from "./filter.js";
import { updateStickyPanel } from "./sticky.js";

const categories = ["soup", "main", "salad", "drink", "dessert"];
export let allDishes = [];

export async function loadDishes() {
    try {
        // Используем локальный файл, так как API лежит
        const response = await fetch("dishes.json");
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        
        allDishes = await response.json();
        loadCart(); // Загружаем ранее выбранные блюда

        categories.forEach((category) => {
            const container = document.querySelector(
                `section[data-category="${category}"] .dishes-grid`
            );
            if (!container) return;

            container.innerHTML = "";

            const filtered = allDishes
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

        initCart(allDishes);
        initFilters();
        updateStickyPanel(); // Обновляем панель при загрузке

    } catch (error) {
        console.error("Ошибка:", error);
    }
}

loadDishes();