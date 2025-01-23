export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
    zipcode: string;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
    zipcode: string;
  };
}
