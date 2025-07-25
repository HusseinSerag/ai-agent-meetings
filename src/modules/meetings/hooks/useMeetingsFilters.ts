import { DEFAULT_PAGE } from "@/constants";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { MeetingStatus } from "../types";

export function useMeetingsFilters() {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
      clearOnDefault: true,
    }),
    status: parseAsStringEnum<MeetingStatus>(Object.values(MeetingStatus)),
    agentId: parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
  });
}
