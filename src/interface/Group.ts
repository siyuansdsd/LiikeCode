export default interface Group {
  GID: string;
  groupName: string;
  groupDescription: string;
  createdAt: string;
  members: string[]; // UID[]
  threads: string[]; // TID[]
  lastMessageAt: EpochTimeStamp;
}
