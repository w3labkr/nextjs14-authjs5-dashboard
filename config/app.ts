import pkg from '@/package.json'

const config = {
  title: 'Acme Inc',
  description: pkg.description,
  version: `v${pkg.version}`,
}

export default config
