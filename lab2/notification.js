export function showNotification(message) {
    // Удаляем старое уведомление, если есть
    const oldNotification = document.querySelector(".notification");
    const oldOverlay = document.querySelector(".overlay");
    if (oldNotification) oldNotification.remove();
    if (oldOverlay) oldOverlay.remove();

    // Создаём оверлей (затемнение)
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    // Создаём само уведомление
    const notification = document.createElement("div");
    notification.className = "notification";

    // Текст уведомления
    const text = document.createElement("p");
    text.textContent = message;

    // Кнопка "Окей"
    const button = document.createElement("button");
    button.textContent = "Окей";

    // Обработчик клика для закрытия
    button.addEventListener("click", () => {
        notification.remove();
        overlay.remove();
    });

    notification.append(text, button);
    document.body.append(overlay, notification);
}