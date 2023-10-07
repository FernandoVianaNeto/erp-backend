export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  /*eslint @typescript-eslint/no-unused-vars: "off"*/
  /*eslint no-unused-vars: "off"*/
  constructorSpy(_createEntityData: T): void {}

  findOne(): { exec: () => T } {
    return {
      exec: (): T => this.entityStub,
    };
  }

  find(): { exec: () => T[] } {
    return {
      exec: (): T[] => [this.entityStub],
    };
  }

  async save(): Promise<T> {
    return this.entityStub;
  }

  async update(): Promise<T> {
    return this.entityStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.entityStub;
  }

  async countDocuments(): Promise<number> {
    return [this.entityStub].length;
  }

  async agreggate(): Promise<T> {
    return this.entityStub;
  }

  async updateMany(): Promise<T> {
    return this.entityStub;
  }
}
