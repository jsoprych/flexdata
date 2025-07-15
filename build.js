// build.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: [
    'src/core/components/FDGrid.ts',
    'src/core/components/FDDetailView.ts',
    'src/core/components/FDStatusBar.ts',
    'src/core/BaseControl.ts',
    'src/data-controller.ts'
  ],
  outdir: 'public/assets/js',
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020', 'chrome58', 'firefox57', 'safari11'],
  format: 'iife'
}).then(() => console.log('Build succeeded')).catch(() => process.exit(1));
