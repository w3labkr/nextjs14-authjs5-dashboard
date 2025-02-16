import pkg from '@/package.json'

const app = {
  title: 'Acme Inc',
  description: pkg.description,
  version: `v${pkg.version}`,
}

export default app
