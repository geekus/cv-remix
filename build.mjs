// import browserSync from 'browser-sync'
// import chalk from 'chalk'
// import { execSync } from 'child_process'
// import commandLineArgs from 'command-line-args'
// import { deleteSync } from 'del'
import esbuild from 'esbuild'
// import fs from 'fs'
// import getPort, { portNumbers } from 'get-port'
import { globby } from 'globby'
// import open from 'open'
// import copy from 'recursive-copy'

// const { bundle, copydir, dir, serve, types } = commandLineArgs([
//   { name: 'bundle', type: Boolean },
//   { name: 'copydir', type: String },
//   { name: 'dir', type: String, defaultValue: 'dist' },
//   { name: 'serve', type: Boolean },
//   { name: 'types', type: Boolean }
// ]);

const outdir = './public/wc/'

// deleteSync(outdir)
// fs.mkdirSync(outdir, { recursive: true })
;(async () => {
  const alwaysExternal = ['react']

  await esbuild
    .build({
      // format: 'esm',
      // target: 'esnext',
      entryPoints: [...(await globby('./src//**/!(*.(style|test)).tsx'))],
      outdir: outdir,
      // chunkNames: 'chunks/[name].[hash]',
      bundle: true,
      //
      // We don't bundle certain dependencies in the unbundled build. This ensures we ship bare module specifiers,
      // allowing end users to better optimize when using a bundler. (Only packages that ship ESM can be external.)
      //
      // We never bundle React or @lit-labs/react though!
      //
      // external: alwaysExternal,
      // splitting: true,
      // plugins: [],
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
})()
