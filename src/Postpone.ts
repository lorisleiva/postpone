type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export class Postpone<T> {
  protected readonly value: () => Promise<T>;

  constructor(value: () => Promise<T>) {
    this.value = value;
  }

  static make<T>(value: () => Promise<T>) {
    return new this(value);
  }

  pipe<U>(callback: (value: T) => U): Postpone<U> {
    return Postpone.make(async () => callback(await this.value()));
  }

  tap(callback: (value: T) => unknown): Postpone<T> {
    return Postpone.make(async () => {
      const value = await this.value();
      callback(value);

      return value;
    });
  }

  log(): Postpone<T> {
    return this.tap(v => console.log(v));
  }

  map<T extends readonly unknown[], U>(
    this: Postpone<ArrayElement<T>[]>,
    callback: (item: ArrayElement<T>, index: number, array: ArrayElement<T>[]) => U,
  ): Postpone<U[]> {
    return this.pipe(t => t.map(callback));
  }

  filter<T extends readonly unknown[]>(
    this: Postpone<ArrayElement<T>[]>,
    callback: (item: ArrayElement<T>, index: number, array: ArrayElement<T>[]) => unknown,
  ): Postpone<ArrayElement<T>[]> {
    return this.pipe(t => t.filter(callback));
  }

  async run(): Promise<T> {
    return this.value();
  }
}
