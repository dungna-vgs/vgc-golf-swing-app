export const GOLF_SWING_STEPS = [
  // { id: 0, name: "NONE" },
  { id: 1, name: 'Chuẩn bị' },
  { id: 2, name: 'Cú vung gậy đầu tiên' },
  { id: 3, name: 'Vung gậy lùi lại' },
  { id: 4, name: 'Đỉnh cú Swing' },
  { id: 5, name: 'Vung gậy xuống' },
  { id: 6, name: 'Điểm tiếp xúc' },
  { id: 7, name: 'Vung gậy tiếp theo' },
  { id: 8, name: 'Hoàn thành' },
];

export const isDevelopment = import.meta.env.MODE === 'development';
export const APP_URL = import.meta.env.VITE_APP_URL;
export const API_URL = isDevelopment
  ? APP_URL + '/api'
  : import.meta.env.VITE_API_URL;
export const RESOURCE_URL = isDevelopment
  ? APP_URL + '/resource'
  : import.meta.env.VITE_RESOURCE_URL;
