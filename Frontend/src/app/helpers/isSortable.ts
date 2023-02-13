import { SortBy, SORT_FIELD } from 'models';

export const getSortableField = (value: string): SortBy => {
	const sortField = SORT_FIELD.find((sortableField) => sortableField === value);
	if (sortField) return sortField;
	throw new Error('Cannot sort');
};
