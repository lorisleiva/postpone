type ArrayElement<ArrayType> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export class Postpone<T> {
  protected readonly value: () => Promise<T>;

  constructor(value: () => Promise<T>) {
    this.value = value;
  }

  static make<T>(value: () => Promise<T>) {
    return new this(value);
  }

  asyncPipe<U>(callback: (value: Promise<T>) => Promise<U>): Postpone<U> {
    return Postpone.make(async () => callback(this.value()));
  }

  pipe<U>(callback: (value: T) => U): Postpone<U> {
    return this.asyncPipe(async (value) => callback(await value));
  }

  asyncTap(callback: (value: Promise<T>) => Promise<unknown>): Postpone<T> {
    return this.asyncPipe(async (value) => {
      callback(value);

      return value;
    });
  }

  tap(callback: (value: T) => unknown): Postpone<T> {
    return this.asyncTap(async (value) => callback(await value));
  }

  log(): Postpone<T> {
    return this.tap(v => console.log(v));
  }

  map<U>(
    this: Postpone<ArrayElement<T>[]>,
    callback: (item: ArrayElement<T>, index: number, array: ArrayElement<T>[]) => U,
  ): Postpone<U[]> {
    return this.pipe(t => t.map(callback));
  }

  filter(
    this: Postpone<ArrayElement<T>[]>,
    callback: (item: ArrayElement<T>, index: number, array: ArrayElement<T>[]) => unknown,
  ): Postpone<ArrayElement<T>[]> {
    return this.pipe(t => t.filter(callback));
  }

  async run(): Promise<T> {
    return this.value();
  }
}
