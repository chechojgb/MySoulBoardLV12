// ssh/ptyManager.js
const pty = require("node-pty");

const sshSessions = new Map();

function createSSHProcess(sessionId, sshConfig, ws) {
  const { username, host, port = 22 } = sshConfig;

  const sshExecutable = "C:\\Windows\\System32\\OpenSSH\\ssh.exe";
  const args = [`${username}@${host}`];
  if (port && port !== 22) args.push("-p", port.toString());

  console.log("🚀 Lanzando SSH con:", sshExecutable, args);

  const ptyProcess = pty.spawn(sshExecutable, args, {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME || process.env.USERPROFILE,
    env: process.env,
  });

  sshSessions.set(sessionId, {
    ptyProcess,
    sockets: new Set([ws]),
  });

  ptyProcess.onData((data) => {
    for (const socket of sshSessions.get(sessionId).sockets) {
      socket.send(JSON.stringify({ output: data }));
    }
  });

  ptyProcess.onExit(() => {
    console.log("❌ PTY cerrado");
    sshSessions.delete(sessionId);
  });

  return ptyProcess;
}

function getSession(sessionId) {
  return sshSessions.get(sessionId);
}

function resizeSession(sessionId, cols, rows) {
  const session = sshSessions.get(sessionId);
  if (session) {
    session.ptyProcess.resize(cols, rows);
  }
}

function cleanupSocket(sessionId, ws) {
  const session = sshSessions.get(sessionId);
  if (!session) return;

  session.sockets.delete(ws);
  if (session.sockets.size === 0) {
    console.log("🧹 Cerrando sesión PTY inactiva:", sessionId);
    session.ptyProcess.kill();
    sshSessions.delete(sessionId);
  }
}

module.exports = {
  createSSHProcess,
  getSession,
  resizeSession,
  cleanupSocket,
};
