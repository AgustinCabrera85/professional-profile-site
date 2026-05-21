export const renderTags = (items, className = 'tag') =>
  items.map((item) => `<span class="${className}">${item}</span>`).join('');

export const renderListItems = (items) =>
  items.map((item) => `<li>${item}</li>`).join('');

export const safePhoneHref = (phone) =>
  phone.replaceAll(' ', '').replaceAll('-', '');
