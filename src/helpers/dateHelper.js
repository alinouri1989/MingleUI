export const formatDateToTR = (dateString) => {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

export const lastMessageDateHelper = (dateString) => {
  const now = new Date();  // Bugünün tarihi
  const date = new Date(dateString);  // Verilen tarih

  // Bugün mü kontrol et
  if (now.toDateString() === date.toDateString()) {
    // Saat ve dakika kısmını döndür
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Dün mü kontrol et
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return "Dün";
  }

  // Daha eski tarihse, tarih formatında döndür
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export const formatDateForLastConnectionDate = (dateString) => {

  if (dateString === null) {
    return "Çevrimiçi";
  }
  const now = new Date();  // Bugünün tarihi
  const date = new Date(dateString);  // Verilen tarih

  // Bugün mü kontrol et
  if (now.toDateString() === date.toDateString()) {
    // Saat ve dakika kısmını döndür
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Bugün ${hours}:${minutes}`;
  }

  // Dün mü kontrol et
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    // Saat ve dakika kısmını döndür
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Dün ${hours}:${minutes}`;
  }

  // Daha eski tarihse, tarih formatında döndür
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export function formatTimeHoursMinutes(isoString) {
  const date = new Date(isoString); // ISO tarihini Date objesine çevir
  const hours = String(date.getHours()).padStart(2, '0'); // Saat bilgisi
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Dakika bilgisi
  return `${hours}:${minutes}`; // Formatlanmış saat ve dakika
}

export function formatCallDuration(callDuration) {
  // Verilen süreyi "00:00:05.9476898" formatından alıp, saat, dakika ve saniye olarak ayıralım
  const [hours, minutes, seconds] = callDuration.split(':');

  // Saat, dakika ve saniyeyi sayıya çevir
  const hoursInt = parseInt(hours);
  const minutesInt = parseInt(minutes);
  const secondsInt = Math.floor(parseFloat(seconds));

  let formattedDuration = '';

  // Eğer saat varsa, saat bilgisini ekleyelim
  if (hoursInt > 0) {
    formattedDuration += `${hoursInt} saat `;
  }

  // Dakika bilgisini ekleyelim
  if (minutesInt > 0) {
    formattedDuration += `${minutesInt} dakika `;
  }

  // Saniye bilgisini ekleyelim
  if (secondsInt > 0 || formattedDuration === '') {
    formattedDuration += `${secondsInt} saniye`;
  }

  return formattedDuration.trim(); // Gereksiz boşlukları temizle
}

export const formatDateForMessageInfo = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};
