const esbuild = require('esbuild');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

if (!fs.existsSync('public/assets/js')) {
  fs.mkdirSync('public/assets/js', { recursive: true });
}

async function build() {
  const context = await esbuild.context({
    entryPoints: [
      { in: 'src/components/csv-grid.ts', out: 'csv-grid' }
    ],
    outdir: 'public/assets/js',
    bundle: true,
    format: 'iife',
    target: 'esnext',
    platform: 'browser',
    minify: !isWatch,
    sourcemap: isWatch,
  });

  if (isWatch) {
    await context.watch();
    console.log('Watching for changes...');
  } else {
    await context.rebuild();
    console.log('Build succeeded');
    await context.dispose();
  }
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});