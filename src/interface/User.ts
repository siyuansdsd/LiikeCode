export default interface User {
  UID: string;
  userName: string;
  email: string;
  password: string;
  profileImageUrl: string;
  createdAt: string;
  Groups: string[]; // GID[]
}
