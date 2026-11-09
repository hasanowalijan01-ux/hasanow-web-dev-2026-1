export function showNotification(message) {
    const oldNotification = document.querySelector(".notification");
    const oldOverlay = document.querySelector(".overlay");
    if (oldNotification) oldNotification.remove();
    if (oldOverlay) oldOverlay.remove();

    // Создаём оверлей
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    // Создаём уведомление и кладём его ВНУТРЬ оверлея
    const notification = document.createElement("div");
    notification.className = "notification";

    const text = document.createElement("p");
    text.textContent = message;

    const button = document.createElement("button");
    button.textContent = "Окей";
    button.addEventListener("click", () => {
        overlay.remove(); // Удаляем оверлей
    });

    notification.append(text, button);
    overlay.appendChild(notification); // Вкладываем!
    
    document.body.appendChild(overlay); // Добавляем на страницу только оверлей
}