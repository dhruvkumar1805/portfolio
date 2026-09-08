import type { IconType } from "react-icons";
import {
  LuBriefcase,
  LuFileText,
  LuFolderGit2,
  LuLayers,
  LuMail,
  LuTerminal,
  LuUser,
} from "react-icons/lu";
import type { AppId } from "@/lib/wm/types";

/** One icon per app, used by the title bars, the dock and the launcher. */
export const APP_ICON: Record<AppId, IconType> = {
  about: LuUser,
  projects: LuFolderGit2,
  work: LuBriefcase,
  stack: LuLayers,
  contact: LuMail,
  resume: LuFileText,
  terminal: LuTerminal,
};
