import React from "react"
import * as Icon from "react-feather"

const horizontalMenuConfig = [



  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.Home size={16} />,
    navLink: "/dashboard",
  },
  {
    id: "portfolio",
    title: "Portfolios",
    type: "item",
    icon: <Icon.Coffee size={16} />,
    navLink: "/portfolios",
  },
  {
    id: "account",
    title: "Account",
    type: "item",
    icon: <Icon.User size={16} />,
    navLink: "/user/view",
  },
  {
    id: "knowledge_base",
    title: "Knowledge Base",
    type: "item",
    icon: <Icon.AlertOctagon size={16} />,
    navLink: "/knowledgebase",
  }
]

export default horizontalMenuConfig
