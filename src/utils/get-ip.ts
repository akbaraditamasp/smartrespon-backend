import * as os from "node:os";

export function getIPv4Addresses() {
  const interfaces = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Hanya ambil IPv4 dan bukan internal (seperti 127.0.0.1)
      if (iface.family === "IPv4" && !iface.internal) {
        results.push({
          name,
          address: iface.address,
        });
      }
    }
  }

  return results;
}
