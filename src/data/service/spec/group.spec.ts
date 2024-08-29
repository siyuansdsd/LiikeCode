import {
  createGroup,
  getGroup,
  getGroups,
  deleteGroup,
  updateGroup,
} from "../group.service";
import DynamoDB from "../../dynamoDB/dynamoDB";
import { Group } from "../../interfaces/interfaces";
