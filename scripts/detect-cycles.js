const fs = require('fs');
const path = require('path');
const dir = 'dist/homeAssets/js';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const graph = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const imports = [];
  const regex = /from\s*["'](\.\/[^"']+)["']/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    imports.push(path.basename(m[1]));
  }
  graph[file] = imports;
}

console.log('Dependency graph:');
for (const [file, deps] of Object.entries(graph)) {
  console.log(file, '->', deps);
}

function findCycles() {
  const visited = new Set();
  const stack = [];
  const cycles = [];

  function dfs(node) {
    if (stack.includes(node)) {
      cycles.push([...stack.slice(stack.indexOf(node)), node]);
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    stack.push(node);
    for (const dep of graph[node] || []) {
      dfs(dep);
    }
    stack.pop();
  }

  for (const node of Object.keys(graph)) {
    dfs(node);
  }
  return cycles;
}

console.log('\nDetected Cycles:');
console.log(findCycles());

