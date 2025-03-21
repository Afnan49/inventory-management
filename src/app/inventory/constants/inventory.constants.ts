export const COLUMNS = [
  { name: 'name', label: 'Name' },
  { name: 'category', label: 'Category' },
  { name: 'stock', label: 'Stock' },
  { name: 'lastUpdated', label: 'Last Updated' },
  { name: 'thumbnail', label: 'Image' },
  { name: 'actions', label: 'Actions' },
];

export const ACTIONS = [
  { id: 'view', label: 'View', icon: 'pi pi-eye' },
  { id: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
  { id: 'delete', label: 'Delete', icon: 'pi pi-trash' },
];
export const DETAILS_BUTTON = [
  {
    id: 'add',
    label: 'Add to Cart',
    icon: 'pi pi-cart-plus',
    class: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    icon: 'pi pi-heart',
    class: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 !text-gray-800',
  },
];
