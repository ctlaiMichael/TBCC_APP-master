export interface serviceMethod {
  //服務據點下拉是選單之服務方式
  id: number,
  id_number: string,
  name: string
}
export interface serviceLocation {
  //服務據點下拉是選單之服務區域
  id: number,
  countycode: string,
  name: string
}
export interface serviceDistrict {
  //服務據點下拉是選單之服務區域
  id: string;
  // countyCode: string;
  districtCode: string;
  name: string;
}
export interface serviceDistrictList {
  //服務據點下拉是選單之服務區域
  [property: string]: serviceDistrict[];
}
export interface serviceAddress {
  //服務據點下拉是選單之服務區域
  id: number;
  name: string;
  address: string;
  tel: string;
  lon: number;
  lat: number;
  active?: boolean;
  distance?: string;
  branchId?: string;
}
export interface currentPostion {
  //服務據點下拉是選單之服務區域
  name: '',
  address: '',
  tel: '',
  lon: '',
  lat: ''
}
export interface servicePhone {
  //服務據點下拉是選單之服務區域
  id: number,
  name: string,
  tel: string,
}

export interface branchDetail {
  //線上取號下拉式選單之分行明細
  id?: number;
  branchId: number;
  branchName: string;
  branchAddr: string;
  postalCode: string;
  telephone: string;
  lon: number;
  lat: number;
  active?: boolean;
  distance?: number;
}
