/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY: string
  readonly VITE_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
