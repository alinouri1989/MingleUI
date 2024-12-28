export const convertToLocalTime = (timestamp) => {
  const date = new Date(timestamp);

  // Türkiye'nin saat dilimi UTC+3 olduğundan, 3 saat ekleyelim
  date.setHours(date.getHours());

  // Saat formatında gösterim: "HH:mm" şeklinde
  const hours = String(date.getHours()).padStart(2, '0'); // Saat
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Dakika

  // Örnek format: "21:02"
  return `${hours}:${minutes}`;
};