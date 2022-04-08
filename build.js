import fs from 'fs'
import ESBuild from 'esbuild'

// Is this a dev build?
let _DEV_ = false
if (process.argv.find((arg) => { return arg === 'dev' })) {
  _DEV_ = true
}

// Read in the userscript config block text
const bannerText = fs.readFileSync('./configBlock.js', { encoding: 'utf8' })

// Configure the build
const options = {
  entryPoints: [
    './src/index.js'
  ],
  banner: {
    js: bannerText
  },
  outfile: './dist/bundle.user.js',
  bundle: true,
  sourcemap: _DEV_,
  minify: (!_DEV_),
  define: {
    _DEV_,
    'process.env.NODE_ENV': (_DEV_ ? '"development"' : '"production"')
  }
}

if (_DEV_) {
  // Serve the results for quick development
  ESBuild.serve({
    servedir: 'dist',
  }, options).then(server => {
    // Call "stop" on the web server to stop serving
    console.log('Server is now running')
  })
} else {
  // Do the build
  ESBuild.build(options).catch(
    (err) => {
      console.error('Failed to build', err)
      process.exit(1)
    }
  )
}
