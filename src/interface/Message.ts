export default interface Message {
  MID: string;
  GID: string;
  UID: string;
  TID?: string;
  content: string;
  createdAt: string;
}
