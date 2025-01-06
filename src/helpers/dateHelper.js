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

export function formatCallCreateDate(createdDate) {
  const now = new Date();
  const date = new Date(createdDate);

  // Bugün mü kontrolü
  const isToday = now.toDateString() === date.toDateString();

  // Eğer bugünse saati döndür
  if (isToday) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  // Eğer dün ya da geçmiş bir tarihse, tarih formatında döndür
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript'te aylar 0'dan başlar
  const year = date.getFullYear();
  return `${day}.${month < 10 ? '0' + month : month}.${year}`;
}
