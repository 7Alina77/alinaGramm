export const BOT_RESPONSES = [
  'Привет! Как дела?',
  'Здорово! Расскажи подробнее',
  'Я тебя понял',
  'Интересно...',
  'А что ты думаешь по этому поводу?',
  'Спасибо, что поделился!',
  '😊',
  '👍',
  'Круто!',
  'Продолжай...',
];

export const BOT_NAME = '🤖 Бот-помощник';

export const getBotResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * BOT_RESPONSES.length);
  return BOT_RESPONSES[randomIndex];
};