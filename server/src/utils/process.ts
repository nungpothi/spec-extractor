import { spawn } from 'child_process';

export function spawnCollect(
  cmd: string,
  args: string[],
  opts?: { timeoutMs?: number }
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { shell: false });
    let stdout = '';
    let stderr = '';
    let finished = false;
    const timeout = opts?.timeoutMs
      ? setTimeout(() => {
          if (finished) return;
          finished = true;
          try {
            child.kill('SIGKILL');
          } catch {}
          resolve({ code: 124, stdout, stderr: stderr + '\n[timeout]' });
        }, opts.timeoutMs)
      : null;

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('error', (e) => {
      if (finished) return;
      finished = true;
      if (timeout) clearTimeout(timeout as NodeJS.Timeout);
      resolve({ code: 127, stdout, stderr: (e as any)?.message || String(e) });
    });
    child.on('close', (code) => {
      if (finished) return;
      finished = true;
      if (timeout) clearTimeout(timeout as NodeJS.Timeout);
      resolve({ code: code ?? 0, stdout, stderr });
    });
  });
}

