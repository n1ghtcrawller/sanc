// api.js
export const fetchProducts = async () => {
    try {
        const response = await fetch('https://keybasicsneutral.ru/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return [];
    }
};
