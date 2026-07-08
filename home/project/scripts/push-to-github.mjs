/**
 * Push the project to GitHub using isomorphic-git
 * 
 * Usage: node scripts/push-to-github.mjs
 * 
 * Notes: .gitignore is NOT preserved because we delete the .git dir after push.
 * But the important thing is that the source code gets pushed.
 */

import * as git from 'isomorphic-git';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const GITHUB_TOKEN = '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';
const REPO_URL = 'https://github.com/girishlade111/freebuff-obsidian-clone.git';

// Extract owner and repo from URL
const match = REPO_URL.match(/github\.com\/([^/]+)\/([^/.]+)/);
const GITHUB_OWNER = match[1];
const GITHUB_REPO = match[2];

const GIT_DIR = path.join(projectRoot, '.git');

async function getFilePaths(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(projectRoot, fullPath);
    
    // Skip node_modules, .git, scripts and other generated dirs
    if (entry.name === 'node_modules' || entry.name === '.git' || 
        entry.name === 'scripts' || entry.name === 'vly-toolbar-readonly.tsx' ||
        relative.startsWith('.')) continue;
    
    if (entry.isDirectory()) {
      files.push(...await getFilePaths(fullPath));
    } else {
      files.push(relative);
    }
  }
  return files;
}

async function main() {
  console.log('📦 Initializing git repo...');
  
  // Initialize git dir
  if (fs.existsSync(GIT_DIR)) {
    fs.rmSync(GIT_DIR, { recursive: true });
  }
  fs.mkdirSync(GIT_DIR, { recursive: true });

  // Get all file paths
  console.log('📂 Collecting files...');
  const filePaths = await getFilePaths(projectRoot);
  console.log(`   Found ${filePaths.length} files`);

  // Write .gitignore
  const gitignore = `node_modules/\n.git/\nscripts/\n*.log\n`;
  fs.writeFileSync(path.join(projectRoot, '.gitignore'), gitignore);

  // Add all files
  console.log('➕ Staging files...');
  for (const filePath of filePaths) {
    const fullPath = path.join(projectRoot, filePath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      try {
        await git.add({ fs, dir: projectRoot, gitdir: GIT_DIR, filepath: filePath });
      } catch (err) {
        console.warn(`   ⚠️  Could not add ${filePath}: ${err.message}`);
      }
    }
  }
  await git.add({ fs, dir: projectRoot, gitdir: GIT_DIR, filepath: '.gitignore' });

  // Commit
  console.log('✏️  Creating commit...');
  const sha = await git.commit({
    fs,
    dir: projectRoot,
    gitdir: GIT_DIR,
    author: {
      name: 'Second Brain Builder',
      email: 'dev@secondbrain.app',
    },
    message: 'Second Brain - Obsidian-like knowledge management app\n\nA local-first, privacy-focused knowledge base with:\n- Bidirectional WikiLinks\n- Force-directed graph view\n- Infinite canvas with Quadtree indexing\n- BM25 full-text search\n- Dataview query engine\n- CodeMirror 6 editor\n- Block-height virtualized editor\n- Plugin API & hotkey engine\n- Audio recorder\n- YAML frontmatter grid',
  });
  console.log(`   Commit: ${sha}`);

  // Push
  console.log('🚀 Pushing to GitHub...');
  try {
    const response = await git.push({
      fs,
      dir: projectRoot,
      gitdir: GIT_DIR,
      remote: 'origin',
      url: `https://${GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git`,
      ref: 'main',
      onProgress: (progress) => {
        if (progress.phase) {
          console.log(`   ${progress.phase}: ${progress.loaded}/${progress.total}`);
        }
      },
    });
    console.log(`   Push result:`, response);
    console.log('✅ Successfully pushed to GitHub!');
    console.log(`   https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`);
  } catch (err) {
    console.error('❌ Push failed:', err.message);
    console.error('   Full error:', err);
    
    // Try alternative: push to 'master' branch instead
    console.log('   Trying master branch...');
    try {
      const response = await git.push({
        fs,
        dir: projectRoot,
        gitdir: GIT_DIR,
        remote: 'origin',
        url: `https://${GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git`,
        ref: 'master',
        onProgress: (progress) => {
          if (progress.phase) {
            console.log(`   ${progress.phase}: ${progress.loaded}/${progress.total}`);
          }
        },
      });
      console.log('✅ Successfully pushed to GitHub (master branch)!');
      console.log(`   https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`);
    } catch (err2) {
      console.error('❌ Second attempt also failed:', err2.message);
      process.exit(1);
    }
  }

  // Cleanup
  console.log('🧹 Cleaning up...');
  if (fs.existsSync(GIT_DIR)) {
    fs.rmSync(GIT_DIR, { recursive: true });
  }
}

main().catch(console.error);
