import { useSelector } from 'react-redux';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import { select } from 'redux-saga/effects';
import { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export function* appSelect<TSelected>(selector: (state: RootState) => TSelected): Generator<any, TSelected, TSelected> {
  return yield select(selector);
}
