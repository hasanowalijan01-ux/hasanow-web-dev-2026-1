const API_KEY = "";

// Базовый URL API (для Netlify)
const BASE_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api";

// Флаг: true - работаем без сервера (через localStorage), 
// false - отправляем реальные запросы на API
const USE_LOCAL_STORAGE = true; 

// --- ФУНКЦИИ ДЛЯ РАБОТЫ С СЕРВЕРОМ (API) ---

// Удаление заказа
export async function deleteOrderFromServer(orderId) {
    const url = `${BASE_URL}/orders/${orderId}?api_key=${API_KEY}`;
    const response = await fetch(url, {
        method: "DELETE",
    });
    
    if (!response.ok) {
        throw new Error("Ошибка при удалении заказа на сервере");
    }
    return await response.json();
}

// Редактирование заказа
export async function updateOrderOnServer(orderId, updatedData) {
    const url = `${BASE_URL}/orders/${orderId}?api_key=${API_KEY}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
        throw new Error("Ошибка при обновлении заказа на сервере");
    }
    return await response.json();
}

// --- ФУНКЦИИ-ОБЕРТКИ (ВЫБИРАЮТ МЕЖДУ API И LOCALSTORAGE) ---

export async function deleteOrder(orderId) {
    if (USE_LOCAL_STORAGE) {
        // Эмуляция удаления
        const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const filtered = allOrders.filter((o) => o.id != orderId);
        localStorage.setItem("orders", JSON.stringify(filtered));
        return { success: true };
    } else {
        // Реальный запрос
        return await deleteOrderFromServer(orderId);
    }
}

export async function updateOrder(orderId, updatedData) {
    if (USE_LOCAL_STORAGE) {
        // Эмуляция обновления
        const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const index = allOrders.findIndex((o) => o.id == orderId);
        if (index !== -1) {
            allOrders[index] = { ...allOrders[index], ...updatedData };
            localStorage.setItem("orders", JSON.stringify(allOrders));
        }
        return { success: true };
    } else {
        // Реальный запрос
        return await updateOrderOnServer(orderId, updatedData);
    }
}