const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/components/fd-grid.ts', 'src/components/fd-detail-view.ts', 'src/data-controller.ts'],
    outdir: 'public/assets/js',
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2020', 'chrome58', 'firefox57', 'safari11'],
    format: 'iife'
}).then(() => console.log('Build succeeded')).catch(() => process.exit(1));