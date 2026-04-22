import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects/'
}, 
{
  label:"Proposals",
  icon: 'i-lucide-file',
  to: '/proposals/'
},
{
  label: 'Contact',
  icon: 'i-lucide-mic',
  to: '/contact/'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about/'
}]
