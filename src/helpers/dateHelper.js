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
