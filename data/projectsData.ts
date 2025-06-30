interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Solving AUV Autonomy',
    description: `A journey to make intelligent underwater robots`,
    imgSrc: '/static/images/auv.png',
    href: '/projects/building-an-auv',
  },
]

export default projectsData
