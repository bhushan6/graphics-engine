export type AttributeData =
  | Float32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array;

export type AttributeInterface = {
  data: AttributeData;
  size: number;
  needsUpdate?: boolean;
};
export class Geometry {
  private _attributes: { [key: string]: AttributeInterface } = {};

  private _indices: Uint16Array;

  public needsUpdate = true;

  constructor(attributes: { [key: string]: AttributeInterface }) {
    const { index, ...rest } = attributes;
    for (const key in rest) {
      this._attributes[key] = attributes[key];
      this._attributes[key].needsUpdate = true;
    }
    this._attributes.index = {
      data: index.data as Uint16Array,
      size: 1,
    };
    this._indices = index.data as Uint16Array;
  }

  public get attributes() {
    return this._attributes;
  }

  public set indices(indices: Uint16Array) {
    this._indices = indices;
  }

  public get indices() {
    return this._indices;
  }
}
