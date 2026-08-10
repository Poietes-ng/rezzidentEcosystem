/** Team member for the about page */
export interface TeamMember {
  name: string
  role: string
  bio?: string
  avatarUrl?: string
  socials?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

/** Company value proposition */
export interface ValueProp {
  title: string
  description: string
  icon?: string
}

/** Company milestone for timeline display */
export interface Milestone {
  year: string
  title: string
  description: string
}
