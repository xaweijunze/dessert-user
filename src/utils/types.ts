export interface IGood {
  id: number;
  name: string;
  price: number;
  typeId: number;
  subTypeId: number;
  icon: string;
  images: IImage[];
  colors: IColor[];
  count: number;
  tabShow: number;
}

export interface IGoodResponse {
  id: number;
  name: string;
  price: number;
  typeId: number;
  subTypeId: number;
  icon: string;
  images: string;
  colors: string;
  count: number;
  tabShow: number;
}

export interface IImage {
  index: number;
  src: string;
}

export interface IColor {
  name: string;
  value: string;
}

export interface ISubtype {
  id: number;
  typeName: string;
  typeId: number;
  grade: number;
  img: string;
}

export interface IType {
  id: number;
  typeName: string;
  grade: number;
}

export interface IComment {
  id: number;
  username: string;
  goodId: number;
  score: number;
  comment: string;
}
export interface IClass {
  classId: number;
  className: string;
  classCount: number;
}
export interface IDessert {
  dessertId: number;
  dessertName: string;
  dessertPrice: number;
  dessertPicture: string;
  dessertSortNum: number;
  dessertMaterial: string;
  dessertIntroduce: string;
  dessertPack: string;
}
export interface IDessertClass {
  dessertId: number;
  dessertName: string;
  dessertPrice: number;
  dessertPicture: string;
  dessertSortNum: number;
  dessertMaterial: string;
  dessertIntroduce: string;
  dessertPack: string;
  class:IClass;
}
export interface IDessertAndClassRes {
  data: IDessertClass[];
  status: string;
  msg: string;
}
export interface IDessertListRes {
  data: IDessert[];
  status: string;
  msg: string;
}
export interface IDessertRes {
    data: IDessert;
    status: string;
    msg: string;
  }
export interface IClassRes {
  data: IClass[];
  status: string;
  msg: string;
}
export interface IOrderRes {
  data: IOrder[];
  status: string;
  msg: string;
}
export interface IOrder {
  orderId: number|undefined;
  orderUserId: number ;
  consigneeName: string;
  consigneePhone: string;
  orderTime: string;
  payType: string;
  payAmount: number|undefined;
  address: string;
  orderState:string;
  orderGoods?:IDessert[];
  dessertIdList?:number[]
}