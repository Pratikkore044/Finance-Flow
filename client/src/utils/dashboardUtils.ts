export const getCategoryIcon = (cat: string) => {
  switch(cat) {
    case 'Food': return '🍔';
    case 'Rent': return '🏠';
    case 'Salary': return '💰';
    case 'Utilities': return '💡';
    case 'Entertainment': return '🎬';
    default: return '🛍️';
  }
};