export interface RoleStatMap {
  roleId: string
  channelId: string
  label: string
}

export const STAT_DEFINITIONS = [
  {
    label: "C3 Core",
    roleKey: "C3_CORE",
    channelKey: "C3_STAT_CORE_CHANNEL_ID",
  },
  {
    label: "C3 Node",
    roleKey: "C3_NODE",
    channelKey: "C3_STAT_NODE_CHANNEL_ID",
  },
  {
    label: "C3 Catalyst",
    roleKey: "C3_CATALYST",
    channelKey: "C3_STAT_CATALYST_CHANNEL_ID",
  },
  {
    label: "C3 Collab",
    roleKey: "C3_COLLAB",
    channelKey: "C3_STAT_COLLAB_CHANNEL_ID",
  },
]
