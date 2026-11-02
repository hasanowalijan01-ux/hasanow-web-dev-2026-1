import { cart } from "./cart.js";
import { showNotification } from "./notification.js";

// Варианты ланчей (что должно быть выбрано)
const variants = [
    {
        soup: true,
        main: true,
        salad: true,
        drink: true,
    }, // 1
    {
        soup: true,
        main: true,
        salad: false,
        drink: true,
    }, // 2
    {
        soup: true,
        main: false,
        salad: true,
        drink: true,
    }, // 3
    {
        soup: false,
        main: true,
        salad: true,
        drink: true,
    }, // 4
    {
        soup: false,
        main: true,
        salad: false,
        drink: true,
    }, // 5
];

// Сначала объявляем все функции
function getErrorMessage(selected) {
    const { soup, main, salad, drink, dessert } = selected;
    const hasAny = soup || main || salad || drink || dessert;

    if (!hasAny) {
        return "Ничего не выбрано. Выберите блюда для заказа";
    }

    if (!drink) {
        return "Выберите напиток";
    }

    if (soup && !main && !salad) {
        return "Выберите главное блюдо/салат/стартер";
    }

    if (salad && !soup && !main) {
        return "Выберите суп или главное блюдо";
    }

    if (!main) {
        return "Выберите главное блюдо";
    }

    return "Выберите главное блюдо";
}

export function initValidation() {
    const form = document.querySelector(".order-section form");
    
    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const selected = {
            soup: !!cart.soup,
            main: !!cart.main,
            salad: !!cart.salad,
            drink: !!cart.drink,
            dessert: !!cart.dessert
        };

        const isValid = variants.some((variant) => 
            variant.soup === selected.soup &&
            variant.main === selected.main &&
            variant.salad === selected.salad &&
            variant.drink === selected.drink
        );

        if (isValid) {
            form.submit(); 
        } else {
            showNotification(getErrorMessage(selected));
        }
    });
}

// Вызываем функцию в самом конце
initValidation();