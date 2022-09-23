export interface LabeledOption<T = string> {
  label: string;
  value: T;
}

export interface OptionLike<TL = string, TV = string> {
  label: TL;
  value: TV;
}

export interface GenericCallback<T = void | Promise<void>> {
  (): T;
}

export interface ReloadableComponentRefs {
  reload: () => void | Promise<void>;
}
