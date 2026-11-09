export let cart = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null,
};

// Загрузка корзины из localStorage
export function loadCart() {
    const saved = localStorage.getItem("foodCart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка чтения корзины", e);
        }
    }
}

// Сохранение корзины в localStorage
export function saveCart() {
    localStorage.setItem("foodCart", JSON.stringify(cart));
}

// Проверка на валидность комбо
export function isValidCombo() {
    const variants = [
        { soup: true, main: true, salad: true, drink: true },
        { soup: true, main: true, salad: false, drink: true },
        { soup: true, main: false, salad: true, drink: true },
        { soup: false, main: true, salad: true, drink: true },
        { soup: false, main: true, salad: false, drink: true }
    ];
    
    const selected = {
        soup: !!cart.soup, main: !!cart.main, salad: !!cart.salad, 
        drink: !!cart.drink, dessert: !!cart.dessert
    };

    return variants.some((variant) => 
        variant.soup === selected.soup &&
        variant.main === selected.main &&
        variant.salad === selected.salad &&
        variant.drink === selected.drink
    );
}

// Получение итоговой суммы
export function getTotalPrice() {
    const dishes = Object.values(cart);
    return dishes.reduce((sum, dish) => {
        return sum + (dish ? dish.price : 0);
    }, 0);
}

// Инициализация кнопок "Добавить" на странице меню
export function initCart(dishesList) {
    document.querySelectorAll(".dish-card button").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".dish-card");
            const keyword = card.dataset.dish;
            const dish = dishesList.find((d) => d.keyword === keyword);

            if (!dish) return;

            cart[dish.category] = dish;
            saveCart(); // Сохраняем в память
            
            // Обновляем интерфейс (выделение карточки)
            document.querySelectorAll(".dish-card").forEach((c) => {
                const kw = c.dataset.dish;
                const isSelected = Object.values(cart)
                    .some((d) => d && d.keyword === kw);
                c.classList.toggle("selected", isSelected);
            });

            // Обновляем нижнюю панель
            import("./sticky.js").then(module => module.updateStickyPanel());
        });
    });
}